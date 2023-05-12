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
exports.saveUser = (req, res) => {
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
            console.error('Error saving model:', err)
        });

};