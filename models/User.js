const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    userID: Schema.Types.ObjectId,
        name: {
            first: {
                type: String,
                trim: true
            },
            last: {
                type: String,
                trim: true
            }
        },
    email: {
        type: String,
        required: true,
    lowercase: true,
    unique: true},
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
        watching: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }]
},
    {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

userSchema.plugin(passportLocalMongoose,{
    usernameField: "email"
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

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

