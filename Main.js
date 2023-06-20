//const port = 3000,
    express = require("express");
    const app = express();
    const homeController = require("./controllers/homeController");
    const usersController = require("./controllers/usersController");
    const productController = require("./controllers/productController");
    layouts = require("express-ejs-layouts");
    const errorController = require("./controllers/errorController");
    const mongoose = require("mongoose");
    mongoose.connect("mongodb://127.0.0.1:27017/FashionPassion",
        {useNewUrlParser: true});
    const db = mongoose.connection;
    mongoose.Promise = global.Promise;
    methodOverride = require("method-override");
    db.once("open", () => {
        console.log("Successfully connected to MongoDB using Mongoose!")
    });

    const User = require("./models/User");
    const expressValidator = require("express-validator");
    const passport = require("passport");



app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from the collection
        res.render('users', { users }); // Pass the users to the view template
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }});
expressSession = require("express-session"),
    cookieParser = require("cookie-parser"),
    connectFlash = require("connect-flash");
app.use(cookieParser("secret_passcode"));
app.use(expressSession({
    secret: "secret_passcode",
    cookie: {
        maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(connectFlash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});




    app.set("view engine","ejs");
app.set("port", process.env.PORT || 3000);
app.use(layouts);
app.use(express.static("public"));
app.use(methodOverride("_method", {methods: ["POST","GET"]}));

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.use(expressValidator());
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
app.get("flash-message", homeController.getFlash-Message);
app.get("/loginpage", homeController.getLogin);
app.get("/thanks", homeController.getThanks);
app.get("/allUsers", homeController.getAllUsers);
app.get("/signup", homeController.getSignup);
app.post("/signupaction", (req, res) => {
    let newUser = new User({
        fullName: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        },
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
        });


});
app.get("/users/login", usersController.login);
app.post("/users/login",
    usersController.authenticate,
    usersController.redirectView);
app.post("/users/create", usersController.validate,
    usersController.create, usersController.redirectView);
app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView);
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView)
app.get("/users/logout", usersController.logout, usersController.redirectView);



app.use(errorController.respondInternalError);
app.use(errorController.respondNoResourceFound);
app.use(errorController.logErrors);
app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost: ${app.get("port")}`
    );
});

