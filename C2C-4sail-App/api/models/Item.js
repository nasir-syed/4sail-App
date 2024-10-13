const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    seller: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    title: String,
    address: String,
    photos: [String],
    description: String,
    price: Number,
    details: [String]
})

const ItemModel = mongoose.model('Item', ItemSchema)

module.exports = ItemModel;