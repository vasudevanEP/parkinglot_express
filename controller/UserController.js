var User = require('../models/users');
var Company = require('../models/company');

/* Get all users */
let getUsers = async (req, res) => {
    let users = [];
    let SessUser = req.user;
    if (SessUser.company) {
        /* Get Company Users Only! */
        users = await User.find({ company: SessUser.company }).exec();
    }
    else {
        /* Get All users - Use in Admin Role only */
        users = await User.find({}).populate('company').exec();
    }

    res.status(200).json({
        status: "success",
        data: users,
        message: "Users List.",
    });
res.end();
}

exports.getUsers = getUsers;

let getUser = async (req, res) => {
    try {
        const id = req.params.id;
        if(id == req.user._id)
        {
            throw new Error('You are not allowed to find this user');
        }
            const data = await User.findById(id)
        
        // data = user.deleteOne({_id: req.params.id});
        
        res.status(200).json({
            status: "success",
            data: data,
            message:
                `Document with ${data.name} has been deleted..`,
        });
    }catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [err.message],
            message: "Internal Server Error",
        });
    }
    res.end();

}
exports.getUser = getUser;

/* Create New Users */

let CreateUser = async (req, res) => {


    let { fullname, phone, email, password, user_role, companyId } = req.body;
    try {

        const existingCompany = await Company.findById(companyId).exec();
        console.log(`Company ${existingCompany}`);
        if (!existingCompany)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Company not found! Contact App Administrator",
            });
        // create an instance of a user
        const newUser = new User({
            fullname,
            phone,
            email,
            password,
            role: user_role || "0x01", /* user role default */
            company: existingCompany._id
        });
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "User Already Exist! Please try with some other email.",
            });
        const savedUser = await newUser.save(); // save new user into the database
        const {role,company, ...user_data } = savedUser._doc;
        res.status(200).json({
            status: "success",
            data: [user_data],
            message:
                "A new user account has been successfully created.",
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
};

exports.createUser = CreateUser;

/* Update User */

let updateUser = async(req, res)=>{
    try {

        // let { fullname,email,phone,password,company,user_role} = req.body;
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        
        
        const result = await User.findOneAndUpdate(
            { _id : id },
             updatedData,
             options
        )

        
        
        const {role,company, ...user_data } = result._doc;
        res.status(200).json({
            status: "success",
            data: [user_data],
            message:
                "A user account has been successfully updated.",
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
exports.updateUser = updateUser;

/* Delete Company */
async function deleteUser(req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        // res.send(user);
        if(id == req.user._id)
        {
            throw new Error('You are not allowed to find this user');
        }
        if(user.role == '0x44')
        {
            throw new Error('You are not allowed to delete this user');
        }

        data = User.deleteOne({ _id: id});
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

exports.deleteUser = deleteUser;