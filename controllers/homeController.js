express=require("express"),
app= express();

app.get("/", (req, res) => {
    let index = req.params.index;
    res.send(`This is the page for ${veg}`);
});
app.get("/items/:vegetable", (req, res) => {
    let veg = req.params.vegetable;
    res.send(`This is the page for ${veg}`);
});
app.use((req, res, next) => {
    console.log(`request made to: ${req.url}`);
    console.log(req.query);
    next();
});
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.post("/", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("POST Successful!");
});

exports.sendReqParam = (req, res) => {
    let veg = req.params.vegetable;
    res.send(`This is the page for ${veg}`);
};

exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { name: paramsName });
};