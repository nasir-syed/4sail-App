const mongoose = require('mongoose')
const {Schema} = mongoose

const WishlistSchema = new Schema({
    user: { type: String, required: true },
    items: { type: [String], default: [] },
});

const WishlistModel = mongoose.model('Wishlist', WishlistSchema);

module.exports = WishlistModel;
