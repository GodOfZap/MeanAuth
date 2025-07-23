const config = require("../config/db.config");
const db = require("../models");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save()
    .then(savedUser => {
      if (req.body.roles) {
        Role.find({
          name: { $in: req.body.roles }
        }).exec()
          .then(roles => {
            savedUser.roles = roles.map(role => role._id);
            savedUser.save()
              .then(() => {
                res.send({ message: "User was registered successfully!" });
              })
              .catch(err => {
                res.status(500).send({ message: err.message });
              });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      } else {
        Role.findOne({ name: "user" }).exec()
          .then(role => {
            savedUser.roles = [role._id];
            savedUser.save()
              .then(() => {
                res.send({ message: "User was registered successfully!" });
              })
              .catch(err => {
                res.status(500).send({ message: err.message });
              });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME // 24 hours
      });

      const authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
