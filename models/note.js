const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    archive: { type: Boolean, default: false },
    image: { type: String },
    reminder: { type: Date },
    checklist: [
      {
        id: { type: String, required: true },
        checked: { type: Boolean, default: false, required: true },
        text: { type: String, required: true },
      },
    ],
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }],
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
