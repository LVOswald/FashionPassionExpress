"use strict";

const Product = require("../models/Product"),
    httpStatus = require("http-status-codes"),
    User = require("../models/user");

module.exports = {
    index: (req, res, next) => {
        Product.find({})
            .then(courses => {
                res.locals.products = products;
                next();
            })
            .catch(error => {
                console.log(`Error fetching products: ${error.message}`);
                next(error);
            });
    },
    indexView: (req, res) => {
        res.render("products/index");
    },
    new: (req, res) => {
        res.render("products/new");
    },

    create: (req, res, next) => {
        let productParams = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category
        };
        Product.create(productParams)
            .then(product => {
                res.locals.redirect = "/products";
                res.locals.product = product;
                next();
            })
            .catch(error => {
                console.log(`Error saving product: ${error.message}`);
                next(error);
            });
    },

    show: (req, res, next) => {
        let productId = req.params.id;
        Product.findById(productId)
            .then(product => {
                res.locals.product = product;
                next();
            })
            .catch(error => {
                console.log(`Error fetching product by ID: ${error.message}`);
                next(error);
            });
    },

    showView: (req, res) => {
        res.render("products/show");
    },

    edit: (req, res, next) => {
        let productID = req.params.id;
        Product.findById(productID)
            .then(product => {
                res.render("products/edit", {
                    product: product
                });
            })
            .catch(error => {
                console.log(`Error fetching product by ID: ${error.message}`);
                next(error);
            });
    },

    update: (req, res, next) => {
        let productId = req.params.id,
            productParams = {
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category
            };

        Product.findByIdAndUpdate(productId, {
            $set: productParams
        })
            .then(product => {
                res.locals.redirect = `/products/${productId}`;
                res.locals.product = product;
                next();
            })
            .catch(error => {
                console.log(`Error updating product by ID: ${error.message}`);
                next(error);
            });
    },

    delete: (req, res, next) => {
        let productId = req.params.id;
        Product.findByIdAndRemove(productId)
            .then(() => {
                res.locals.redirect = "/products";
                next();
            })
            .catch(error => {
                console.log(`Error deleting product by ID: ${error.message}`);
                next();
            });
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
    respondJSON: (req, res) => {
        res.json({
            status: httpStatus.OK,
            data: res.locals
        });
    },
    errorJSON: (error, req, res, next) => {
        let errorObject;
        if (error) {
            errorObject = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            };
        } else {
            errorObject = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Unknown Error."
            };
        }
        res.json(errorObject);
    },
    join: (req, res, next) => {
        let productId = req.params.id,
            currentUser = req.user;
        if (currentUser) {
            User.findByIdAndUpdate(currentUser, {
                $addToSet: {
                    products: productId
                }
            })
                .then(() => {
                    res.locals.success = true;
                    next();
                })
                .catch(error => {
                    next(error);
                });
        } else {
            next(new Error("User must log in."));
        }
    },
    filterUserProducts: (req, res, next) => {
        let currentUser = res.locals.currentUser;
        if (currentUser) {
            let mappedProducts = res.locals.products.map(product => {
                let userJoined = currentUser.products.some(userProduct => {
                    return userProduct.equals(product._id);
                });
                return Object.assign(product.toObject(), { joined: userJoined });
            });
            res.locals.products = mappedProducts;
            next();
        } else {
            next();
        }
    }
};