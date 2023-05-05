exports.getHomepage = (req,res) => {
    res.render("index");
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

exports.getLogin= (req,res) => {
    res.render("login");
}

exports.getThanks= (req,res) => {
    res.render("thanks");
}

exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { name: paramsName });
};