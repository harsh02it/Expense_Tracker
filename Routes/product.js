const Joi = require("joi");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  volume: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 5,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    min: 0
  }
});

const Product = mongoose.model("Product", productSchema);

// const stocks = [
//   { id: 8902967601691, name: "Romanov 90ml" },
//   { id: 8902967600212, name: "Romanov 180ml" },
//   { id: 8902967600205, name: "Romanov 375ml" },
//   { id: 8902967600199, name: "Romanov 750ml" },
// ];

router.get("/", async (req, res) => {
  const product = await Product.find();
  res.send(product);
});

router.post("/", async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = new Product({
    _id: req.body._id,
    name: req.body.name,
    volume: req.body.volume,
    price: req.body.price,
  });

  product = await product.save();

  res.send(product);
});

router.put("/:_id", async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(
    req.params._id,
    {
      _id: req.params._id,
      name: req.params.name,
      volume: req.params.volume,
      price: req.params.price,
    },
    { new: true }
  );

  if (!product)
    return res.status(404).send("The stock with the given ID was not found.");

  res.send(product);
});

router.delete("/:_id", async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params._id);

  if (!product)
    return res.status(404).send("The stock with the given ID was not found.");

  res.send(product);
});

router.get("/:_id", async (req, res) => {
  const product = await Product.findById(req.params._id);

  if (!product)
    return res.status(404).send("The stock with the given ID was not found.");

  res.send(product);
});

function validateProduct(product) {
  const schema = {
    _id: Joi.string().required(),
    name: Joi.string().min(3).required(),
    volume: Joi.number().min(2).required(),
    price: Joi.number().min(2).required(),
  };

  return Joi.validate(product, schema);
}

module.exports = router;
module.exports.Product = Product;

