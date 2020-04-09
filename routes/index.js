const auth = require("./auth");
const notes = require("./notes");
const authenticate = require("../middleware/authenticate");

const routes = (app) => {
  app.use("/api/auth", auth);
  app.use("/api/notes", authenticate, notes);
};

module.exports = routes;
