"use strict";
const { request } = require("express");
const Validator = require("fastest-validator");
const models = require("../models");

//store data
function save(req, res) {
  //   console.log(req.body);
  const post = {
    title: req.body.title,
    context: req.body.context,
    imageUrl: req.body.imageUrl,
    categoryId: req.body.categoryId,
    userId: req.userData.userId,
  };
  console.log(req.userData);
  const schema = {
    title: { type: "string", optional: false, max: "100" },
    context: { type: "string", optional: false, max: "500" },
    categoryId: { type: "number", optional: false },
  };
  const v = new Validator();
  const validationResponse = v.validate(post, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  }

  // check categoryId is valid before sending request
  models.Category.findByPk(req.body.categoryId).then((result) => {
    if (result != null) {
      models.Post.create(post)
        .then((result) => {
          res.status(201).json({
            message: "Post created Successfully",
            post: result,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Something went wrong",
            error: error,
          });
        });
    } else {
      res.status(400).json({
        message: "Invalid Category Id",
      });
    }
  });
}

// show post with id
function show(req, res) {
  const id = req.params.id;
  models.Post.findByPk(id)
    .then((result) => {
      //   console.log(result);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(400).json({
          message: "Record not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
}

// get all the posts
function index(req, res) {
  models.Post.findAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong!!",
        error: error,
      });
    });
}

// update the post
function update(req, res) {
  const id = req.params.id;
  const updatedPost = {
    title: req.body.title,
    context: req.body.context,
    imageUrl: req.body.imageUrl,
    categoryId: req.body.categoryId,
  };

  const userId = req.userData.userId,

  const schema = {
    title: { type: "string", optional: false, max: "100" },
    context: { type: "string", optional: false, max: "500" },
    categoryId: { type: "number", optional: false },
  };
  const v = new Validator();
  const validationResponse = v.validate(updatedPost, schema);

  if (validationResponse !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: validationResponse,
    });
  }

  // check categoryId is valid before sending request
  models.Category.findByPk(req.body.categoryId).then((result) => {
    if (result != null) {
      models.Post.update(updatedPost, { where: { id: id, userId: userId } })
        .then((result) => {
          res.status(200).json({
            message: "Post updated successfuly",
            post: updatedPost,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Something went wrong",
            error: error,
          });
        });
    } else {
      res.status(400).json({
        message: "Invalid Category Id",
      });
    }
  });
}

function destroy(req, res) {
  const id = req.params.id;
  const userId = req.userData.userId;
  models.Post.destroy({ where: { id: id, userId: userId } })
    .then((result) => {
      res.status(200).json({
        message: "Post deleted successfuly",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    });
}

module.exports = {
  save: save,
  show: show,
  index: index,
  update: update,
  destroy: destroy,
};
