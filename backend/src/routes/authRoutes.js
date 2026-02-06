const express = require("express");
const { register, login, me } = require("../controllers/authController");
const { validate } = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/authSchemas");
const { authRequired } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authRequired, me);

module.exports = router;
