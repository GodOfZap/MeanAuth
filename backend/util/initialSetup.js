const mongoose = require("mongoose");
const Role = require("../models/role.model");
const dbConfig = require("../config/db.config");

function initialSetup() {
  mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    Role.estimatedDocumentCount()
      .then(count => {
        if (count === 0) {
          new Role({
            name: "user"
          }).save()
            .then(() => console.log("added 'user' to roles collection"))
            .catch(err => console.error("error on adding user role", err));

          new Role({
            name: "moderator"
          }).save()
            .then(() => console.log("added 'moderator' to roles collection"))
            .catch(err => console.error("error on adding moderator role", err));

          new Role({
            name: "admin"
          }).save()
            .then(() => console.log("added 'admin' to roles collection"))
            .catch(err => console.error("error on adding admin role", err));
        }
      })
      .catch(err => console.error("error checking role count", err));
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
}

module.exports = initialSetup;
