const mongoose = require("mongoose"),
  User = require("./models/user"),
  Product = require("./models/product");
var testProduct, testUser;
mongoose.connect(
  "mongodb://localhost:27017/FashionPassion",
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
User.remove({})
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => {
    return Product.remove({});
  })
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => {
    return User.create({
    name: {
    first: "Jon",
    last: "Wexler"
    email: "jon@jonwexler.com",
    password: "pas123"
    });
  })
  .then(user => {
    console.log(`Created User: ${user.getInfo()}`);
  })
  .then(() => {
    return User.findOne({
      name: "Jon"
    });
  })
  .then(user => {
    testUser = user;
    console.log(`Found one user: ${user.getInfo()}`);
  })
  .then(() => {
    return Product.create({
      title: "Oversize hoodie",
      description: "Oversize marl grey hoodie with a drawstring hood",
      price: "29,99$ " ,
      category: "SWEATSHIRTS & HOODIES"
    });
  })
  .then(product => {
    testProduct = product;
    console.log(`Created product: ${product.title}`);
  })
  .then(() => {
    testUser.products.push(testProduct);
    testUser.save();
  })
  .then(() => {
    return User.populate(testUser, "products");
  })
  .then(user => console.log(user))
  .then(() => {
    return User.find({
      products: mongoose.Types.ObjectId(testProduct._id)
    });
  })
  .then(user => console.log(user));