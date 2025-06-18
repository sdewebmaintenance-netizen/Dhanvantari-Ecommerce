const express = require("express");
const passport = require("passport");
const { googleCallback, failure, loginWithPhone, signupWithPhone, forgotPassword } = require("../controllers/auth.controller");
const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get("/google/callback", passport.authenticate("google"), googleCallback);

router.get("/failure", failure);

router.post("/login", loginWithPhone);
router.post("/signup", signupWithPhone);

router.post("/forgot-password", forgotPassword);

module.exports = router;
