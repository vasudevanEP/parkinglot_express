var express = require('express');
var router = express.Router();
var AuthController = require('../controller/AuthController');
var Validate = require('../middleware/validate');
var { Verify, VerifyAdminRole } = require('../middleware/verify');
var {check} = require('express-validator');




// Register route -- POST request
router.post("/register",
check("email")
.isEmail()
.withMessage("Enter a valid email address")
.normalizeEmail(),
check("fullname")
.not()
.isEmpty()
.withMessage("You name is required")
.trim()
.escape(),
check("phone")
.not()
.isEmpty()
.withMessage("You phone is required")
.trim()
.escape(),
check("password")
.notEmpty()
.isLength({ min: 8 })
.withMessage("Must be at least 8 chars long"),
Validate,
AuthController.Register
);

// Login route == POST request
router.post(
    "/login",
    check("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
    check("password").not().isEmpty().withMessage("Recheck your email and password"),
    Validate,
    AuthController.Login
);

router.get("/user", Verify, (req, res) => {
    res.status(200).json({
        status: "success",
        data : [req.user],
        message: "Welcome to the your Dashboard!",
    });
});

router.get("/admin", Verify, VerifyAdminRole, (req, res) => {
    res.status(200).json({
        status: "success",
        data : [req.user],
        message: "Welcome to the your Admin Dashboard!",
    });
});

// Logout route ==
router.get('/logout', AuthController.Logout);

module.exports = router;