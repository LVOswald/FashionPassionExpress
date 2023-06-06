const User = require("../models/User");

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
exports.saveUser = (req, res, next) => {
    let newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    });

    newUser.save()
        .then((result) => {
            console.log('Model saved successfully', result);
            res.render("thanks");
        })
        .catch((err) => {
            console.error('Error saving model:', err);
            next(error);
        });

};
const userController = {
show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
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
    res.render("allUsers");
},

edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
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

update: (req, res, next) => {
    let userId = req.params.id,
        userParams = {
            name: {
                first: req.body.first,
                last: req.body.last
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        };
    User.findByIdAndUpdate(userId, {
        $set: userParams
    })
        .then(user => {
            res.locals.redirect = `/users/${userId}`;
            res.locals.user = user;
            next();
        })
        .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
            next(error);
        });},
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(() => {
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`Error deleting user by ID: ${error.message}`);
                next();
            }); },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    }

};
module.exports = userController;