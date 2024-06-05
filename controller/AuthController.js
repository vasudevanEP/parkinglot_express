var User = require('../models/users');
var Company = require('../models/company');
var Blacklist = require('../models/blacklist');
var bcrypt = require('bcrypt');

/**
 * @route POST v1/auth/register
 * @desc Registers a user
 * @access Public
 */
async function Register(req, res) {
    // get required variables from request body
    // using es6 object destructing
    const { fullname, phone, email, password, company_name  } = req.body;
    try {

        /* Create a company instance for a user */
        const newcompany = new Company({
            name: company_name
        });
        // Check if company already exists
        const existingCompany = await Company.findOne({ name:company_name });
        if (existingCompany)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "Company Name already exists! Contact your Account Manager",
            });
        const savedCompany = await newcompany.save();

        // create an instance of a user
        const newUser = new User({
            fullname,
            phone,
            email,
            password,
            role: "0x44", //customer admin role
            company : savedCompany._id
        });
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
        const savedUser = await newUser.save(); // save new user into the database
        const { role, ...user_data } = savedUser._doc;
        res.status(200).json({
            status: "success",
            data: [user_data],
            message:
                "Thank you for registering with us. Your account has been successfully created.",
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

exports.Register = Register;


async function Login(req, res) {
    // Get variables for the login process
    const { email } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email }).select("+password").populate('company');
        if (!user)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // if user exists
        // validate password
        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        // if not valid, return unathorized response
        console.log(isPasswordValid);
        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid email or password. Please try again with the correct credentials.",
            });
        // return user info except password
        const { password, ...user_data } = user._doc;

        let options = {
            maxAge: 20 * 60 * 1000, // would expire in 20minutes
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };
        const token = user.generateAccessJWT(); // generate session token for user
        res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request

        res.status(200).json({
            status: "success",
            data: [user_data],
            message: "You have successfully logged in.",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.end();
}

exports.Login = Login;

async function Logout(req, res) {
    try {
      const authHeader = req.headers['cookie']; // get the session cookie from request header
      if (!authHeader) return res.sendStatus(204); // No content
      const cookie = authHeader.split('=')[1]; // If there is, split the cookie string to get the actual jwt token
      const accessToken = cookie.split(';')[0];
      const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
      // if true, send a no content response.
      if (checkIfBlacklisted) return res.sendStatus(204);
      // otherwise blacklist token
      const newBlacklist = new Blacklist({
        token: accessToken,
      });
      await newBlacklist.save();
      // Also clear request cookie on client
      res.setHeader('Clear-Site-Data', '"cookies"');
      res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
    res.end();
  }

  exports.Logout = Logout;