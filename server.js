const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const config = require("config");
const dbDebug = require("debug")("app:db");
const auth = require("./routes/auth");

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined in config.");
  process.exit(1);
}

console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

mongoose
  .connect("mongodb://localhost/notable", {
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

app.get("/", (req, res) => res.send("Hi there!"));

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
