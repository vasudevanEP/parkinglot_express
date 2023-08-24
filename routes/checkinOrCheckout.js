var express = require('express');
var router = express.Router();

var TicketsModel = require('../models/tickets');
var VehicleTypeModel = require('../models/vehicleTypes');

const saveTickets = (req) => {
    let today = new Date();
    let date = today.getFullYear() + '-' + ("0" + (today.getMonth()+1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2) 
    + ' '+ ("0" + today.getHours()).slice(-2) + ':' + ("0" + today.getMinutes()).slice(-2) + ':' + ( "0" + today.getSeconds()).slice(-2); 
    const ticket = new TicketsModel({
        vehicle_number: null,
        vehicle_type_id: req.body.vehicle_type_id,
        time_in : date,
        ticket_number:  Math.random().toString(36).substring(2,14)
    });
    // console.log(data);
    return ticket.save();
    
}

function toHoursAndMinutes(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);
  
    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { h: hours, m: minutes, s: seconds };
  }

const updateCheckOut = async (req) => {
    ticket_number = req.body.ticket_number;
    
    /* Tickets Details */ 
    ticketDetail = await  TicketsModel.findOne({ticket_number : ticket_number});
    if (ticketDetail != null) {
        /* Get vehicle Details */
        
        const vehicletype = await VehicleTypeModel.findById( ticketDetail.vehicle_type_id ).exec();
        let today = new Date();
        const timeout = today.getFullYear() + '-' + ("0" + (today.getMonth()+1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2) 
        + ' '+ ("0" + today.getHours()).slice(-2) + ':' + ("0" + today.getMinutes()).slice(-2) + ':' + ( "0" + today.getSeconds()).slice(-2); 

        const start = new Date(ticketDetail.time_in).getTime();
        const end = new Date().getTime();
        const diff = end - start;
        const totalSeconds = Math.floor(diff / 1000 ) ;

        const time = await toHoursAndMinutes(totalSeconds);

        const total_price = await calculateTotalPrice(time.h,time.m,vehicletype.initial_hrs,vehicletype.inital_entry_cost,vehicletype.additional_cost);
       
        const data = {
            time_out: timeout,
            total_price : total_price,
            status : 'left'
        }
        const options = { new: true };
        const updateTimeOut = TicketsModel.findByIdAndUpdate(ticketDetail.id, data,options)

       return updateTimeOut;
    }
    // return tickets;
};

function calculateTotalPrice(hrs,mins,initial_hrs,initial_entry_costs,additional_cost) {
    if(hrs > initial_hrs) {
        var total_price= 0;
        var additional_time = (hrs - initial_hrs);
        var remaining_cost = (additional_time * additional_cost);
        if(mins > 0)
        {
            remaining_cost += parseInt(additional_cost);
        }
        total_price = parseInt(initial_entry_costs) + remaining_cost;
        // return remaining_cost;
        return total_price;
    }
    else{
        return initial_entry_costs;
    }
}

/* Check In Tickets */
router.post('/', async (req, res) => {
    try {
        data = await saveTickets(req);
        res.json(data);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.put('/', async(req, res) => {
    try {
        data = await updateCheckOut(req);
        res.json(data);
    }catch (err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;