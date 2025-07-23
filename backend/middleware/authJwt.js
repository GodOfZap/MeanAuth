const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user.model");
const Role = require("../models/role.model");

dotenv.config();

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Handle "Bearer " prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId)
    .populate("roles", "-__v")
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({ message: "Require Admin Role!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

isModerator = (req, res, next) => {
  User.findById(req.userId)
    .populate("roles", "-__v")
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      for (let i = 0; i < user.roles.length; i++) {
        if (user.roles[i].name === "moderator") {
          next();
          return;
        }
      }
      res.status(403).send({ message: "Require Moderator Role!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;