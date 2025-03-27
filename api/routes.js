const express = require("express");
const router = express.Router();
const { userRegister, userLogin, healthcheck} = require("./controller");
const auth = require("../middleware/auth");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/healthcheck", auth, healthcheck);

module.exports = router;
