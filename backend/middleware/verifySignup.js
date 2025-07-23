const User = require("../models/user.model");
const Role = require("../models/role.model");

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec()
    .then(user => {
      if (user) {
        return res.status(400).send({ message: "Failed! Username is already in use!" });
      }
      // Email
      User.findOne({
        email: req.body.email
      }).exec()
        .then(emailUser => {
          if (emailUser) {
            return res.status(400).send({ message: "Failed! Email is already in use!" });
          }
          next();
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    Role.find({}).exec()
      .then(roles => {
        const availableRoles = roles.map(role => role.name);
        for (let i = 0; i < req.body.roles.length; i++) {
          if (!availableRoles.includes(req.body.roles[i])) {
            return res.status(400).send({
              message: `Failed! Role ${req.body.roles[i]} does not exist!`
            });
          }
        }
        next();
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  } else {
    next();
  }
};

const verifySignup = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignup;