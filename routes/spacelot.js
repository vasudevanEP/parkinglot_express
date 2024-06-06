var express = require('express');
var router = express.Router();
var { Verify, VerifyCustomerRole } = require('../middleware/verify');
var SpacelotController = require('../controller/SpacelotController');
var {check} = require('express-validator');
var Validate = require('../middleware/validate');
const { verify } = require('jsonwebtoken');

/* GET users listing. */
router.get('/', Verify ,  SpacelotController.getall);
router.get('/:id',Verify, VerifyCustomerRole, SpacelotController.getspace);

router.post('/',
check("space_name")
.not()
.isEmpty()
.withMessage("Space name is required")
.trim()
.escape(),
check("initial_hour_cost")
.not()
.isEmpty()
.withMessage("Initial hour cost is required")
.trim()
.escape(),
check("additional_cost")
.not()
.isEmpty()
.withMessage("Additional cost is required")
.trim()
.escape(),
check("initial_hrs")
.not()
.isEmpty()
.withMessage("Initial Hour is required")
.trim()
.escape(),
check("capacity")
.not()
.isEmpty()
.withMessage("capacity is required")
.trim()
.escape(),
check("parking_type")
.not()
.isEmpty()
.withMessage("parking type is required")
.trim()
.escape(),

check("companyId")
.not()
.isEmpty()
.withMessage("Company ID is required")
.trim(),
Validate, Verify , VerifyCustomerRole, SpacelotController.createSpace);

router.patch('/:id',check("space_name")
.not()
.isEmpty()
.withMessage("Space name is required")
.trim()
.escape(),
check("initial_hour_cost")
.not()
.isEmpty()
.withMessage("Initial hour cost is required")
.trim()
.escape(),
check("additional_cost")
.not()
.isEmpty()
.withMessage("Additional cost is required")
.trim()
.escape(),
check("initial_hrs")
.not()
.isEmpty()
.withMessage("Initial Hour is required")
.trim()
.escape(),
check("capacity")
.not()
.isEmpty()
.withMessage("capacity is required")
.trim()
.escape(),
check("parking_type")
.not()
.isEmpty()
.withMessage("parking type is required")
.trim()
.escape(),
check("companyId")
.not()
.isEmpty()
.withMessage("Company ID is required")
.trim(),
Validate, Verify , VerifyCustomerRole, SpacelotController.updateSpace);

router.delete('/:id',Verify, VerifyCustomerRole, SpacelotController.deleteSpace);

module.exports = router;
