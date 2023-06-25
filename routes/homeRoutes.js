const router = require("express").Router(),
    homeController = require("../controllers/homeController");



router.get("/", homeController.getHomepage);
router.get("/name/:myName",
    homeController.respondWithName);
router.get("/about", homeController.getAbout);
router.get("/contact", homeController.getContact);
router.get("/error", homeController.getError);
router.get("/feedback_form", homeController.getFeedback_Form);
router.get("flash-message", homeController.getFlash_Message);
router.get("/loginpage", homeController.getLogin);
router.get("/thanks", homeController.getThanks);
router.get("/allUsers", homeController.getAllUsers);
router.get("/signup", homeController.getSignup);

module.exports = router;