const { Note } = require("../models/note");
const { Label } = require("../models/label");

async function listNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.user._id });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: { message: "It's not you, it's us." } });
  }
}

async function createNote(req, res) {}

async function updateNote(req, res) {}

async function removeNote(req, res) {}

async function listLabels(req, res) {
  try {
    const labels = await Label.find({ userId: req.user._id });

    res.status(200).json(labels);
  } catch (err) {
    res.status(500).json({ error: { message: "It's not you, it's us." } });
  }
}

async function updateLabels(req, res) {}

module.exports = {
  listNotes,
  createNote,
  updateNote,
  removeNote,
  listLabels,
  updateLabels,
};
