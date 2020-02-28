const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const auth = require("./routes/auth");

const app = express();

mongoose
  .connect("mongodb://localhost/notable", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB."));

const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/api/auth", auth);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));