const router = require("express").Router();
const userRoutes = require("./userRoutes");
const errorRoutes = require("./errorRoutes");
const homeRoutes = require("./homeRoutes");
const productRoutes = require("./productRoutes");
const apiRoutes = require("./apiRoutes");

router.use("/api", apiRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);


module.exports = router;