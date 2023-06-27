const router = require("express").Router(),
    productController = require("../controllers/productController");

router.get("/products", productController.index, productController.indexView);
router.get("/products/new", productController.new);
router.post("/products/create", productController.create, productController.redirectView);
router.get("/products/:id/edit", productController.edit);
router.put("/products/:id/update", productController.update, productController.redirectView);
router.get("/products/:id", productController.show, productController.showView);
router.delete("/products/:id/delete", productController.delete, productController.redirectView);

module.exports = router;