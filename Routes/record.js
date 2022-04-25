const Joi = require("joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Product } = require('./product');
const { TotalInventory } = require('./totalInventory');

const recordSchema = new mongoose.Schema({
  product: {
    type: new mongoose.Schema({
      _id: {
        type: String,
        required: true,
      }
    }),
    required: true
  },
  quantity: {
      type: Number,
      required: true,
      min: 0,
  }
});

const Record = mongoose.model("Record", recordSchema);

router.get("/", async (req, res) => {
  const record = await Record.find();
  res.send(record);
});

router.post("/", async (req, res) => {
  const { error } = validateRecord(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findById(req.body._id);
  if (!product) return res.status(400).send('Invalid product.');

  //write a comparison statement to check whether the stock for the product is available or not.
  //if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let record = new Record({
    product: {
        _id: product._id
    },
    quantity: {$inc:{quantity:1}},
  });

  record = await record.save();

  res.send(record);
});

// router.put("/:_id", async (req, res) => {
//   const { error } = validateRecord(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const record = await Record.findByIdAndUpdate(
//     req.params._id,
//     {
//       _id: req.params._id,
//       price: req.params.price,
//     },
//     { new: true }
//   );

//   if (!record)
//     return res.status(404).send("The stock with the given ID was not found.");

//   res.send(record);
// });

// router.delete("/:_id", async (req, res) => {
//   const record = await Record.findByIdAndRemove(req.params.bar_ID);

//   if (!record)
//     return res.status(404).send("The stock with the given ID was not found.");

//   res.send(record);
// });

// router.get("/:_id", async (req, res) => {
//   const record = await Record.findById(req.params._id);

//   if (!record)
//     return res.status(404).send("The stock with the given ID was not found.");

//   res.send(record);
// });

function validateRecord(record) {
  const schema = {
    _id: Joi.string().required(),
    quantity: Joi.number().min(0).required(),
  };

  return Joi.validate(record, schema);
}

module.exports = router;
