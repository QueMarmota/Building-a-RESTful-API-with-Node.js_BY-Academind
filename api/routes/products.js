const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message: 'Manejador de peticiones GET /products'
    });
});

router.post('/',(req,res,next)=>{
    console.log(req.body);
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'Manejador de peticiones POST /products',
        createdProduct:product
    });
});

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    if(id === 'special')
    {
        res.status(200).json({
            message: 'Encontraste el id especial',
            id: id
        });    
    }
    else{
        res.status(200).json({
            message: 'Pasaste un ID'
        });
    }
})

router.put('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    res.status(200).json({
        message: 'products actualizada'
    });
})

router.delete('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    res.status(200).json({
        message: 'products eliminada'
    });
})
module.exports = router;