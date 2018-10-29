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


# Implementacion de authorization

en el recurso se agrega checkaut despues de ya haberlo exportado
const checkAuth = require('../middleware/check-auth');
//para hacer el post con una imagen en post man hay que boner el body en form-data en key llenamos las columnas de los campos y en value los valores
//despues de llenar los campos agregamos en  la columna el tipo de dato file y en value seleccionamos el archivo y en headers quitamos el content type de json y le damos send
//tambien hay q agregar el header AUTHORIZATION, y en el value Bearer y despues el token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRleHN0M0B0ZXN0LmNvbSIsInVzZXJJZCI6IjViZDY5NDQxNWY2ZWVhMjUwNDEwZjk0MCIsImlhdCI6MTU0MDc5MTU4NywiZXhwIjoxNTQwNzk1MTg3fQ.pbEg1ka2Sw31gXJiRehC1NaJfmyOjt5PDLN3_HkgvkY
router.post('/', checkAuth,upload.single('productImage'), (req, res, next) => {

## Clase para authetificacion
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        //console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth Faoled'
        })
    }


}