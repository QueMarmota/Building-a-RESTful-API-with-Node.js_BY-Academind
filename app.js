const express = require('express');
const app = express();
const morgan = require('morgan');//morgan nos regresa el resultado y tiempo de las peticiones
const bodyParser = require('body-parser');//body parser se utiliza para cuando hacemos post con json para traer los datos con req.body
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products')//rutas que nos llevan a nuestros recursos
const orderRoutes = require('./api/routes/orders')
//mongoose
//la cadena de conexion se obtiene de la paginad e mongo despues de haber creado un cluster con atlas y MONGO_ATLAS_PW es la contraseña que definimos para el usuario del cluster
//y esa pw se encuentra en nodemon.json para no tener que ponerla en la cadena de conexion(la contraseña no debe tener caracteres especiales).
mongoose.connect("mongodb://node-shop:"+
    process.env.MONGO_ATLAS_PW+
    "@node-rest-shop-practica-shard-00-00-uw98x.mongodb.net:27017,node-rest-shop-practica-shard-00-01-uw98x.mongodb.net:27017,node-rest-shop-practica-shard-00-02-uw98x.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-practica-shard-0&authSource=admin&retryWrites=true"
    ,{ useNewUrlParser: true }
    
);
mongoose.Promise = global.Promise;
//morgan 
app.use(morgan('dev'));
//BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//CORS
//aqui le dedimos al servidor que cualquier cliente pueda hacer peticiones a el ,(CORS)
app.use((req,res,next)=>{
    res.header('Acces-Control-Allow-Origin','*');//el asterisco especifica cuales clientes pueden acceder a la API
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({

        });
    }
    next();
})

//rutas que deben manejar una peticion
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);


app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
   res.status(error.status||500);
   res.json({
       error: {
           message:error.message
       }
   })  
});
module.exports = app;