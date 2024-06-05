const mongoose = require('mongoose');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
       
    },
    state: {
        type: String,
    },
    zipcode: {
        type: String,
        default : null
    },
    country: {
        type: String,
        default : null
    },
    status : {
        type: String,
        enum: ['active', 'inactive'],
        default : 'active'
    },
    company_gst : {
        type : String,
        default : null
    }
}, { timestamps: true },{strict: true})

module.exports = mongoose.model('company', dataSchema)