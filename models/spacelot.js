const mongoose = require('mongoose');
const { Schema } = mongoose;

const SpacelotSchema = new mongoose.Schema(
    {
        space_name: {
            type: String,
            required: "Your Space Name is required",
            max: 75,
        },
        initial_hour_cost: {
            required: true,
            type : String,
            default : '10.00'
        },
        additional_cost: {
            required: true,
            type : String,
            default : '10.00'
        },
        initial_hrs: {
            required: false,
            type: Number,
            default : 3
        },
        capacity: {
            type: Number,
            default:100
        },
        vehicle_type: {
            type: String,
        },
        parking_type: {
            type: String,
            enum : ['public', 'private'],
            default : 'public'
        },
        company : { type: Schema.Types.ObjectId, ref: 'company' }
    },
    { timestamps: true },
    {strict: true}
);

module.exports = mongoose.model('spacelot', SpacelotSchema)