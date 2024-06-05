var express = require('express');
var router = express.Router();
var { Verify, VerifyCustomerRole } = require('../middleware/verify');
var UserControllers = require('../controller/UserController');
var {check} = require('express-validator');
var Validate = require('../middleware/validate');
const { verify } = require('jsonwebtoken');

/* GET users listing. */
router.get('/', Verify ,  UserControllers.getUsers);
router.get('/:id',Verify, VerifyCustomerRole, UserControllers.getUser);

router.post('/',check("email")
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
check("companyId")
.not()
.isEmpty()
.withMessage("Company ID is required")
.trim(),
Validate, Verify , VerifyCustomerRole, UserControllers.createUser);

router.patch('/:id',check("email")
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
check("companyId")
.not()
.isEmpty()
.withMessage("Company ID is required")
.trim(),
Validate, Verify , VerifyCustomerRole, UserControllers.updateUser);

router.delete('/:id',Verify, VerifyCustomerRole, UserControllers.deleteUser);

module.exports = router;
