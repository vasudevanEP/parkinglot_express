var express = require('express');
var router = express.Router();
var vehicleTypeModel = require('../models/vehicleTypes');

/* GET Vehicle types. */
router.get('/', async function(req, res, next) {
    try {
        const data = await vehicleTypeModel.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

/* Get A Vehicle Type by ID */
router.get('/:id', async (req, res) => {
    try {
        const data = await vehicleTypeModel.findById(req.params.id);
            res.json(data);

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});


/* Post New Vehicle Type */
router.post('/', async (req, res) =>{
    try {
        const data = new vehicleTypeModel({
            name: req.body.name,
            capacity: req.body.capacity,
            initial_hrs: req.body.initial_hrs,
            inital_entry_cost: req.body.inital_entry_cost,
            additional_cost: req.body.additional_cost,
        });
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

/* Update vehicle type */
router.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        
        const result = await vehicleTypeModel.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* Delete a Vehicle Type */
router.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const data = await vehicleTypeModel.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



module.exports = router;
