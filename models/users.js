const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN


const UserSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: "Your firstname is required",
            max: 75,
        },
        phone: {
            type: String,
            required: "Your Phone is required",
            max: 15,
        },
        email: {
            type: String,
            required: "Your email is required",
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: "Your password is required",
            select: false,
            max: 25,
        },
        role: {
            type: String,
            required: true,
            default: "0x01",
        },
        company : { type: Schema.Types.ObjectId, ref: 'company' }
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.pre("findOneAndUpdate", function(next) {
    let update = {...this.getUpdate()};

  // Only run this function if password was modified
  if (update.password){

  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  update.password = bcrypt.hashSync(update.password, salt);
//   console.log(update);
  this.setUpdate(update);
  next();
  }
})



UserSchema.methods.generateAccessJWT = function () {
    let payload = {
      id: this._id,
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
      expiresIn: '20m',
    });
  };

module.exports = mongoose.model("users", UserSchema);