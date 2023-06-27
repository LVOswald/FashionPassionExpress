const router = require("express").Router(),
productController = require("../controllers/productController");

router.get("/products", productController.index,
    productController.respondJSON);
router.use(productController.errorJSON);
router.get("/products/:id/watch", productController.watch,
    productController.respondJSON);

module.exports = router;
