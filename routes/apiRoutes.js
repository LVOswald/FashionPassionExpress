const router = require("express").Router(),
productController = require("../controllers/productController");
const token = process.env.TOKEN || "fashionToken";
usersController = require("../controllers/usersController");


router.use(usersController.verifyToken);
router.post("/login", usersController.apiAuthenticate)
router.get("/products", productController.index,
    productController.respondJSON);
router.use(productController.errorJSON);
router.get("/products/:id/watch", productController.watch,
    productController.respondJSON);

module.exports = router;
