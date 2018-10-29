const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({//condiciones de que se va guardar 
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }


}
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter

})//donde se van a guardar las uploads


const Product = require('../models/product');//archivo donde obtenemos el schema de producto

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {//aqui le damos estructura a los datos que nos va regresar
                count: docs.length,
                //aqui mapeamos los productos para obtener su valor por separado
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage:doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            //url de nuestro serv
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    };
                })
            };
            //El codigo dle if es para si no existen datos
            // if (docs.length >= 0) {
            res.status(200).json(response);
            // }else{
            //     res.status(404).json({
            //         message:'No hay datos'
            //     });
            // }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});
//para hacer el post con una imagen en post man hay que boner el body en form-data en key llenamos las columnas de los campos y en value los valores
//despues de llenar los campos agregamos en  la columna el tipo de dato file y en value seleccionamos el archivo y en headers quitamos el content type de json y le damos send
router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path        
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });


});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log('From database', doc);//si todo salio bn
            if (doc)//si el id existe
            {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get product by id',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                });
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
})

router.put('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    //Este ciclo nos ayuda para checar que campos se cambiaron y si no se modificaron campos se queda con los actuales
    //evitandonos el tener que validar si solo quiere actualizar el nombre o el precio y despues hacer la actualizacion
    //pero con este ajuste cambia la forma en como hacemos el put en el body , puesto que hay q pasarle un arreglo con el propName
    // [
    // {"propName":"name","value":"Leche"}
    // ]
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            err.status(500).json({
                error: err
            });
        });
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
        _id: id
    }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: { name: 'String', price: "Number" }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})
module.exports = router;