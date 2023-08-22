const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    capacity: {
        type: Number,
        default:100
    },
    initial_hrs: {
        required: false,
        type: Number,
        default : 3
    },
    inital_entry_cost : {
        required: true,
        type : String,
        default : '10.00'
    },
    additional_cost : {
        required: true,
        type : String,
        default : '10.00'
    }
}, { timestamps: true })

module.exports = mongoose.model('vehicle_types', dataSchema)