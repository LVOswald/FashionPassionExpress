//const port = 3000,
    express = require("express");
    app = express();
    router = require("./routes/index"),
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
    passport = require("passport");
    methodOverride = require("method-override");
    db.once("open", () => {
        console.log("Successfully connected to MongoDB using Mongoose!")
    });

    User = require("./models/User");
    expressValidator = require("express-validator");

    server = app.listen(app.get("port"), () => {
        console.log(`Server running at http://localhost:${ app.get("port") }`);
    }),
    io = require("socket.io")(server);

    require("./controllers/chatController")(io);




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

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
});




    app.set("view engine","ejs");
app.set("port", process.env.PORT || 3000);
app.use(layouts);
app.set("token", process.env.TOKEN || "fashionToken");
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


/*app.get("/", homeController.getHomepage);
app.get("/name/:myName",
    homeController.respondWithName);
app.get("/about", homeController.getAbout);
app.get("/contact", homeController.getContact);
app.get("/error", homeController.getError);
app.get("/feedback_form", homeController.getFeedback_Form);
app.get("flash-message", homeController.getFlash_Message);
app.get("/loginpage", homeController.getLogin);
app.get("/thanks", homeController.getThanks);
app.get("/allUsers", homeController.getAllUsers);
app.get("/signup", homeController.getSignup);
app.post("/users/create", usersController.validate,
    usersController.create, usersController.redirectView);
app.get("/users/login", usersController.login);
app.post("/users/login", usersController.authenticate);
app.get("/users/logout", usersController.logout, usersController.redirectView);
app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView);
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView)




app.use(errorController.respondInternalError);
app.use(errorController.respondNoResourceFound);
app.use(errorController.logErrors);*/

app.use("/", router);
app.listen(app.get("port"), () => {
    console.log(`Server running at http://localhost: ${app.get("port")}`
    );
});



