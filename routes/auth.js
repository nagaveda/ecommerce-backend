const express = require("express");
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const {check} = require("express-validator");

router.post("/signup",[
    check("name").isLength({min:3}).withMessage('name must be minimum of 3 characters..'),
    check("email").isEmail().withMessage('Must be a valid email'),
    check("password").isLength({min:5}).matches(/\d/).withMessage('Password must be of minimum 5 characters and include numbers..')
] ,signup);
router.post("/signin",[
    check("email").isEmail().withMessage('Must be a valid email'),
    check("password").isLength({min:5}).matches(/\d/).withMessage('Password must be of minimum 5 characters and include numbers..')
] ,signin);

router.get("/signout", signout);

router.get("/protected", isSignedIn , (req, res) => {
    res.send("Protected.....");
} )
module.exports = router;
