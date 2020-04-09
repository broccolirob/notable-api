const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: false },
    description: { type: String, required: false },
    archive: { type: Boolean, default: false },
    image: {},
    time: { type: Date },
    reminder: { type: Date, required: false },
    checklist: {},
    labels: {},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = { Note };
