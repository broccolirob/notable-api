require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const config = require("config");
const dbDebug = require("debug")("app:db");
const auth = require("./routes/auth");

const app = express();

if (!config.get("jwt.key")) {
  console.error("FATAL ERROR: jwt private key or expiration time not set.");
  process.exit(1);
}

mongoose
  .connect("mongodb://db:27017/notable", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    dbDebug(
      `Successfully connected to Mongo.
      Database name: ${conn.connections[0].name}
      Database host: ${conn.connections[0].host}
      Database port: ${conn.connections[0].port}\n`
    );
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    dbDebug(
      "An error occurred while trying to connect to the database. ",
      err.message
    );
    console.error("Could not connect to MongoDB.");
  });

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/api/auth", auth);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
