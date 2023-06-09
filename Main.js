//const port = 3000,
    express = require("express"),
    app = express(),
    homeController = require("./controllers/homeController");
    usersController = require("./controllers/usersController");
    productController = require("./controllers/productController");
    layouts = require("express-ejs-layouts");
    errorController = require("./controllers/errorController");
    mongoose = require("mongoose");
    mongoose.connect("mongodb://127.0.0.1:27017/FashionPassion",
        {useNewUrlParser: true});
    db = mongoose.connection;
    mongoose.Promise = global.Promise;
    db.once("open", () => {
        console.log("Successfully connected to MongoDB using Mongoose!")
    });

    const User = require("./models/User");





    app.set("view engine","ejs");
app.set("port", process.env.PORT || 3000);
app.use(layouts);
app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());

app.use((req, res, next) => {
    console.log(`request made to: ${req.url}`);
    next();
});

app.post("/", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("POST Successful!");
});


app.get("/", homeController.getHomepage);
app.get("/name/:myName",
    homeController.respondWithName);
app.get("/about", homeController.getAbout);
app.get("/contact", homeController.getContact);
app.get("/error", homeController.getError);
app.get("/feedback_form", homeController.getFeedback_Form);
app.get("/login", homeController.getLogin);
app.get("/thanks", homeController.getThanks);
app.get("/allUsers", homeController.getAllUsers);
app.post("/signup", usersController.saveUser);

app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView);
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView)



app.use(errorController.respondInternalError);
app.use(errorController.respondNoResourceFound);
app.use(errorController.logErrors);
app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost: ${app.get("port")}`
    );
});

