const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    userID: Schema.Types.ObjectId,
    fullName: {
    firstname: {
        type: String,
    required: true,
    trim: true},
    lastname: {
        type: String,
        required: true,
    trim: true},
    },
    email: {
        type: String,
        required: true,
    lowercase: true,
    unique: true},
    password: {
        type: String,
        required: true},
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

userSchema.pre("save", async function (next) {
    try {
        let user = this;
        let tester = await User.findOne({ email: user.email });

        if (tester && tester.email && tester.email === user.email) {
            tester.products = user.products;
            next();
        } else {
            next();
        }
    } catch (error) {
        console.log(`Error in overwriting existing user: ${error.message}`);
        next(error);
    }
});

userSchema.pre("save", function(next) {
    let user = this;
    bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash;
        next();
    })
        .catch(error => {
            console.log(`Error in hashing password: ${error.message}`);
            next(error);
        });
});
userSchema.methods.passwordComparison = function(inputPassword){
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
};
userSchema.virtual("fullname")
    .get(function() {
        return `${this.name.firstname} ${this.name.lastname}`;
    });
userSchema.methods.getInfo = function(){
    return `First Name: ${this.firstname} Last Name: ${this.lastname} Email: ${this.email}`;
}
userSchema.methods.findUserByFirstname = function() {
    return this.model("User")
        .find({firstname: this.firstname})
        .exec();
};
const User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);

