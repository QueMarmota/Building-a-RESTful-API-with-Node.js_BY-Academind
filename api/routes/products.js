const express = require('express');
const router = express.Router();

const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

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

router.get('/', ProductsController.products_get_all);
//para hacer el post con una imagen en post man hay que boner el body en form-data en key llenamos las columnas de los campos y en value los valores
//despues de llenar los campos agregamos en  la columna el tipo de dato file y en value seleccionamos el archivo y en headers quitamos el content type de json y le damos send
//tambien hay q agregar el header AUTHORIZATION, y en el value Bearer y despues el token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRleHN0M0B0ZXN0LmNvbSIsInVzZXJJZCI6IjViZDY5NDQxNWY2ZWVhMjUwNDEwZjk0MCIsImlhdCI6MTU0MDc5MTU4NywiZXhwIjoxNTQwNzk1MTg3fQ.pbEg1ka2Sw31gXJiRehC1NaJfmyOjt5PDLN3_HkgvkY
router.post('/', checkAuth, upload.single('productImage'),ProductsController.create_product);

router.get('/:productId',ProductsController.products_get_product);

router.put('/:productId', checkAuth,ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);
module.exports = router;