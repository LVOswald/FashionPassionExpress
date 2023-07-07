const router = require("express").Router(),
productController = require("../controllers/productController");
usersController = require("../controllers/usersController");


//router.use(usersController.verifyToken);

router.post("/login", usersController.apiAuthenticate);
router.use(usersController.verifyJWT);
router.get("/products", productController.index, productController.respondJSON);
router.use(productController.errorJSON);
router.get("/products/:id/watch", productController.watch, productController.respondJSON);

module.exports = router;