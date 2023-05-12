const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: Schema.Types.ObjectId,
    firstname: String,
    lastname: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);