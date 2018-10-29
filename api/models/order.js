const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true },//conectar este esquema con product,la relacion se crea aqui    
    quantity: { type: Number, delfault: 1 }

});


module.exports = mongoose.model('Order', orderSchema);

