const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
    productID: Schema.Types.ObjectId,
    title: String,
    description: String,
    price: Number,
    category: String,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
