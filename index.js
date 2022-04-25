const Joi = require("joi");
const product = require("./Routes/product");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const record = require("./Routes/record");
const totalInventory = require("./Routes/totalInventory");

mongoose
  .connect("mongodb://localhost/inventory")
  .then(() => console.log("Connected to Inventory Database..."))
  .catch((err) => console.error("Could not connect to Inventory Database..."));

app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use("/api/product", product);
app.use("/api/totalInventory", totalInventory);
app.use("/api/record", record);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
