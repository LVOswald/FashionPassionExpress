exports.getHomepage = (req,res) => {
    res.render("users/index");
}

exports.getAbout= (req,res) => {
    res.render("about");
}

exports.getContact= (req,res) => {
    res.render("contact");
}

exports.getError= (req,res) => {
    res.render("error");
}

exports.getFeedback_Form= (req,res) => {
    res.render("feedback_form");
}

exports.getFlash_Message= (req,res) => {
    res.render("flash-message");
}

exports.getLogin= (req,res) => {
    res.render("users/login");
}

exports.getSignup= (req,res) => {
    res.render("signup");
}

exports.getEditor= (req,res) => {
    res.render("users/editor");
}

exports.getThanks= (req,res) => {
    res.render("thanks");
}
exports.getAllUsers= (req,res) => {
    res.render("users");
}



exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { name: paramsName });
};