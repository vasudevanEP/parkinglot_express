var express = require('express');
var router = express.Router();
var { Verify, VerifyAdminRole } = require('../middleware/verify');
var companyModel = require('../models/company');
var CompanyController = require('../controller/CompanyController');

/* GET Companies. */
router.get('/', Verify, VerifyAdminRole, CompanyController.getall);

/* Get A Company by ID */
router.get('/:id', CompanyController.getCompany);

/* Post a company */
router.post('/', Verify, VerifyAdminRole, CompanyController.createCompany);

/* Update company */
router.patch('/:id',Verify, VerifyAdminRole, CompanyController.updateCompany)

/* Delete a Company */
router.delete('/:id',Verify, VerifyAdminRole, CompanyController.deleteCompany)

module.exports = router;