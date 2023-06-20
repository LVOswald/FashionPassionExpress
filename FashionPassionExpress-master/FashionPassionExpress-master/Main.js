
const port = 3000,
    express = require("express"),
    layouts = require("express-ejs-layouts");
    app = express();

const homeController = require("./controllers/homeController");

app.set("view engine", "ejs");
app.use(layouts);
app.get("/", homeController.sendReqParam);
app.get("/views/index.ejs", homeController.sendReqParam);
app.get("/name/:myName", homeController.respondWithName)

app.listen(3000, () => {
    console.log(`The Express.js server has started and is listening
! on port number: ${port}`);
});