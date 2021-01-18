"use strict";
const models = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");

function signUp(req, res) {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const schema = {
    name: { type: "string", optional: false, max: "100" },
    email: {
      type: "string",
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: {
        args: true,
        msg: "Email address already in use!",
      },
    },
    password: { type: "string", optional: false, min: "8", max: "25" },
  };
  const v = new Validator();
  const validationResponse = v.validate(newUser, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  }
  models.User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        res.status(409).json({
          message: "Email already exists",
        });
      } else {
        bcryptjs.genSalt(10, function (err, salt) {
          bcryptjs.hash(req.body.password, salt, function (err, hash) {
            const user = {
              name: req.body.name,
              email: req.body.email,
              password: hash,
            };

            models.User.create(user)
              .then((result) => {
                res.status(200).json({
                  message: "User registered successfully",
                  result: user,
                });
              })
              .catch((error) => {
                res.status(500).json({
                  message: "Something went wrong",
                });
              });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
      });
    });
}

function login(req, res) {
  const loginUser = {
    email: req.body.email,
    password: req.body.password,
  };
  const schema = {
    email: {
      type: "string",
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: { type: "string", optional: false },
  };
  const v = new Validator();
  const validationResponse = v.validate(loginUser, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  }
  models.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user === null) {
        res.status(401).json({
          message: "Invalid Credentials",
        });
      } else {
        bcryptjs.compare(
          req.body.password,
          user.password,
          function (err, result) {
            if (result) {
              const token = jwt.sign(
                {
                  email: user.email,
                  userId: user.id,
                },
                process.env.JWT_KEY,
                function (err, token) {
                  res.status(200).json({
                    message: "Authenication Successfull",
                    token: token,
                  });
                }
              );
            } else {
              res.status(401).json({
                message: "Invalid Credentials",
              });
            }
          }
        );
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
      });
    });
}

module.exports = {
  signUp: signUp,
  login: login,
};
