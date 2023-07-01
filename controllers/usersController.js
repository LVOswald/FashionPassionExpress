const jsonWebToken = require("jsonwebtoken");

const User = require("../models/User"),
    passport = require("passport"),
    getUserParams = body => {
        return {
            name: {
                first: body.first,
                last: body.last
            },
            email: body.email,
            password: body.password,
            products: body.products
        };
    };

exports.getAllUsers = (req, res, next) => {
    User.find({})
        .exec()
        .then((users) => {
        res.render("users", {
            users: users
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
exports.getUserPage = (req,res) => {
    res.render("contact");
}
module.exports = {
    index: (req, res, next) => {
        User.find()
            .then(users => {
                res.locals.users = users;
                next();
            })
            .catch(error => {
                console.log(`Error fetching users: ${error.message}`);
                next(error);
            });
    },
    indexView: (req, res) => {
        if (req.query.format === "json") {
            res.json(res.locals.products);
        } else {
            res.render("products/index");
        }
    },
    new: (req, res) => {
        res.render("signup");
    },
    create: (req, res, next) => {
        if (req.skip) return next();
        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (e, user) => {
            if (user) {
                req.flash("success", `${user.fullName}'s account created successfully!`);
                res.locals.redirect = "/users";
                next();
            } else {
                req.flash("error", `Failed to create user account because: ${e.message}.`);
                res.locals.redirect = "/signup";
                next();
            }
        });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
    let userID = req.params._id;
    User.findOne(userID)
        .then(user => {
            res.locals.user = user;
            next();
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        });
},
    showView: (req, res) => {
    res.render("thanks");
},

edit: (req, res, next) => {
    let userID = req.params.id;
    User.findOne({userID})
        .then(user => {
            res.render("edit", {
                user: user
            });
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        });
},
    verifyToken: (req, res, next) => {
        let token = req.query.apiToken;
        if (token) {
            User.findOne({ apiToken: token })
                .then(user => {
                    if (user) next();
                    else next(new Error("Invalid API token."));
                })
                .catch(error => {
                    next(new Error(error.message));
                });
        } else {
            next(new Error("Invalid API token."));
        }
    },
update: (req, res, next) => {
    let userId = req.params._id,
        userParams = {
            name: {
                first: req.body.first,
                last: req.body.last
            },
            password: req.body.password,
        };

    User.findOneAndUpdate(userId, {
        $set: userParams
    })
        .then(user => {
            res.locals.redirect = `/users/${userId}`;
            res.locals.user = user;
            next();
        })
        .catch(error => {
            console.log(`Error updating user by Id: ${error.message}`);
            next(error);
        });},
    delete: (req, res, next) => {
        let userEmail = req.params.email;
        User.findOneAndDelete(userEmail)
            .then(() => {
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`Error deleting user by ID: ${error.message}`);
                next();
            }); },
    login: (req, res) => {
        res.render("users/login");
    },
    validate: (req, res, next) => {
        req
            .sanitizeBody("email")
            .normalizeEmail({
                all_lowercase: true
            })
            .trim();
        req.check("email", "Email is invalid").isEmail();
        req.check("password", "Password cannot be empty").notEmpty();
        req.getValidationResult().then(error => {
            if (!error.isEmpty()) {
                let messages = error.array().map(e => e.msg);
                req.skip = true;
                req.flash("error", messages.join(" and "));
                res.locals.redirect = "/users/new";
                next();
            } else {
                next();
            }
        });
    },
    /*authenticate: passport.authenticate('local', {
        failureRedirect: "/users/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
        successFlash: "Logged in!"}),*/
    apiAuthenticate: (req, res, next) => {
        passport.authenticate("local", (errors, user) => {
            if (user) {
                let signedToken = jsonWebToken.sign(
                    {
                        data: user._id,
                        exp: new Date().setDate(new Date().getDate() + 1)
                    },
                    "secret_encoding_passphrase"
                );
                res.json({
                    success: true,
                    token: signedToken
                });
            } else
                res.json({
                    success: false,
                    message: "Could not authenticate user."
                });
        })(req, res, next);
    },
    verifyJWT: (req, res, next) => {
        let token = req.headers.token;
        if (token) {
            jsonWebToken.verify(
                token,
                "secret_encoding_passphrase",
                (errors, payload) => {
                    if (payload) {
                        User.findById(payload.data).then(user => {
                            if (user) {
                                next();
                            } else {
                                res.status(httpStatus.FORBIDDEN).json({
                                    error: true,
                                    message: "No User account found."
                                });
                            }
                        });
                    } else {
                        res.status(httpStatus.UNAUTHORIZED).json({
                            error: true,
                            message: "Cannot verify API token."
                        });
                        next();
                    }
                }
            );} else {
            res.status(httpStatus.UNAUTHORIZED).json({
                error: true,
                message: "Provide Token"
            });
        }
    },
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    }
};
