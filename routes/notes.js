const express = require("express");
const Notes = require("../controllers/notes");

const router = express.Router();

router.get("/", Notes.listNotes);

router.post("/create-note", Notes.createNote);

router.post("/update-note", Notes.updateNote);

router.post("/remove-note", Notes.removeNote);

router.get("/labels", Notes.listLabels);

router.post("/update-labels", Notes.updateLabels);

module.exports = router;
