const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
  },
});

const Label = mongoose.model("Label", labelSchema);

module.exports = { Label };
