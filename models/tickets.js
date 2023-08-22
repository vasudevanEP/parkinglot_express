const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    vehicle_number: {
        required: true,
        type: String
    },
    ticket_number: {
        type: String,
       
    },
    vehicle_type_id: {
        type: String,
    },
    time_in: {
        type: String,
        default : null
    },
    time_out: {
        type: String,
        default : null
    },
    status : {
        type: String,
        enum: ['parked', 'left','closed'],
        default : 'parked'
    },
    total_price : {
        type : String,
        default : null
    }
}, { timestamps: true })

module.exports = mongoose.model('tickets', dataSchema)