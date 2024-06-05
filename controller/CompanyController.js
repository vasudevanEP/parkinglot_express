var companyModel = require('../models/company');

async function getall(req,res)
{
    try {
        const data = await companyModel.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getall = getall;

async function getCompany(req, res)
{
    try {
        const data = await companyModel.findById(req.params.id);
            res.json(data);

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getCompany = getCompany;

/* Create Company */
async function createCompany(req, res)
{
    try {
        const data = new companyModel({
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            address: req.body.address,
            state: req.body.state,
            zipcode: req.body.zipcode,
            country: req.body.country,
            status: req.body.status || 'active',
            company_gst : req.body.company_gst 
        });
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.createCompany = createCompany;

/* Update a Company */
async function updateCompany(req, res){
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        
        const result = await companyModel.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
} 
exports.updateCompany = updateCompany;

/* Delete Company */
async function deleteCompany(req, res) {
    try {
        const id = req.params.id;
        const data = await companyModel.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
exports.deleteCompany = deleteCompany;