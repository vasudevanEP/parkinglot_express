var express = require('express');
var router = express.Router();

var TicketsModel = require('../models/tickets');

const saveTickets = (req) => {
    let today = new Date();
    let date = today.getFullYear() + '-' + ("0" + (today.getMonth()+1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2) 
    + ' '+ ("0" + today.getHours()).slice(-2) + ':' + ("0" + today.getMinutes()).slice(-2) + ':' + ( "0" + today.getSeconds()).slice(-2); 
    const ticket = new TicketsModel({
        vehicle_number: req.body.vehicle_number,
        vehicle_type_id: req.body.vehicle_type_id,
        time_in : date,
        ticket_number:  Math.random().toString(36).substring(2,14)
    });
    // console.log(data);
    return ticket.save();
    
}
/* Get All tickets */
router.get('/', async (req, res) => {
    try {
        const data = await TicketsModel.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

router.post('/', async (req, res) => {
    try {
        data = await saveTickets(req);
        // res.send('Response of POSt')
        res.json(data);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});


module.exports = router;