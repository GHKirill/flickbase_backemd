const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.js");

router.post("/register", authController.register);
router.post("/signin", authController.signIn);
router.get("/isauth", auth(), authController.isAuth);

// router.post("/testrole", auth("createAny", "test"), authController.testRole);

module.exports = router;
