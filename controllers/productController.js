exports.getAllProducts = (req, res, next) => {
    Product.find({})
        .exec()
        .then((products) => {
            res.render("products", {
                products: products
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};

exports.getProductPage = (req, res) => {
    res.render("product");
};

exports.saveProduct = (req, res) => {
    let newProduct = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category
    });

    newProduct
        .save()
        .then((result) => {
            console.log("Model saved successfully", result);
            res.render("thanks");
        })
        .catch((err) => {
            console.error("Error saving model:", err);
        });
};