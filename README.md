# Practica-Building-a-RESTful-API-with-Node.js_BY-Academind

## Este es un repositorio de tutorial de Academind - RESTful-API-with-Node.js

## Se implementa Node.js , MongoDB entre otras paqueterias# Building-a-RESTful-API-with-Node.js_BY-Academind


* `npm init -y`
* `npm install --save express`
* `npm install --save-dev nodemon`
* `npm install --save morgan`
* `npm install --save body-parser`
* `npm install --save mongoose`
* `npm install --save multer` //alternativa a body parser
* ` npm install --save bcrypt@1.0.2` //para encriptar las passwords , tuve que usar una version mas antigua por q me salian errores con la actual npm install bcrypt
* `npm install jsonwebtoken`//Para user las tokens
* 





# Estructura Basica de una Route

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

module.exports = router;


# Estructura basica de un modelo


const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true },//conectar este esquema con product,la relacion se crea aqui    
    quantity: { type: Number, delfault: 1 }

});


module.exports = mongoose.model('Order', orderSchema);
