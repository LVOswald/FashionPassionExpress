exports.getHomepage = (req,res) => {
    res.render("index");
}

exports.getAbout= (req,res) => {
    res.render("about");
}

exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { name: paramsName });
};