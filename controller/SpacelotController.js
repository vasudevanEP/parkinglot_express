var Spacelot = require('../models/spacelot');
var Company = require('../models/company');
const { get } = require('mongoose');

/* Get All Spaces */
let getall = async (req, res) => {

    let users = [];
    let SessUser = req.user;
    if (SessUser.company) {
        /* Get Company Space Only! */
        spaces = await Spacelot.find({ company: SessUser.company }).exec();
    }
    else {
        /* Get All users - Use in Admin Role only */
        spaces = await Spacelot.find({}).populate('company').exec();
    }
    res.status(200).json({
        status: "success",
        data: spaces,
        message: "Spacelot List.",
    });
res.end();
};

exports.getall = getall;

/* Get a space */
let getspace = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Spacelot.findById(id);
        res.status(200).json({
            status: "success",
            data: data,
            message:
                ``,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [err.message],
            message: "Internal Server Error",
        });
    }
}

exports.getspace = getspace;

/* Create new space */

let createSpace = async (req, res) => {
    try {

        let {space_name, initial_hour_cost, additional_cost, initial_hrs, capacity,vehicle_type, parking_type, companyId} = req.body;

        const existingCompany = await Company.findById(companyId).exec();
        console.log(`Company ${existingCompany}`);
        if (!existingCompany)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Company not found! Contact App Administrator",
            });

            // create an instance of a user
            const newspace = new Spacelot({
                space_name,
                initial_hour_cost,
                additional_cost,
                initial_hrs,
                capacity,
                vehicle_type,
                parking_type,
                company: existingCompany._id
            });

            const existingSpace = await Spacelot.findOne({ space_name, company:companyId  });
        if (existingSpace)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Space name Already Exist! Please try with some other name.",
            });
        const savedSpace = await newspace.save();
        const {company, ...user_data } = savedSpace._doc;
        res.status(200).json({
            status: "success",
            data: [user_data],
            message:
                "A new space has been successfully created.",
        });
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [err.message],
            message: "Internal Server Error",
        });
    }
}

exports.createSpace = createSpace

/* Update space */
let updateSpace = async (req, res) => {
    try {

        // let { fullname,email,phone,password,company,user_role} = req.body;
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        
        const result = await Spacelot.findOneAndUpdate(
            { _id : id },
             updatedData,
             options
        )
        const {company, ...user_data } = result._doc;
        res.status(200).json({
            status: "success",
            data: user_data,
            message:
                "Space has been successfully updated.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [err.message],
            message: "Internal Server Error",
        });
    }
    res.end();
}

exports.updateSpace = updateSpace;

/* Delete A space */
let deleteSpace = async (req, res) => {
    try {
        const id = req.params.id;
        const space = await Spacelot.findById(id);
        
        data = space.deleteOne({ _id: id});
        // res.send(`Document with ${data.name} has been deleted..`)
        res.status(200).json({
            status: "success",
            data: [],
            message:
                `Document has been deleted..`,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [err.message],
            message: "Internal Server Error",
        });
    }
    res.end();
}

exports.deleteSpace = deleteSpace;