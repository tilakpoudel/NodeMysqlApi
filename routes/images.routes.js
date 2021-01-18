const express = require("express");
const imageController = require("../controllers/image.controller");
const imageUploader = require("../helpers/image-uploader");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = new express.Router();

router.post(
  "/upload",
  checkAuthMiddleware.checkAuth,
  imageUploader.upload.single("image"),
  imageController.upload
);

module.exports = router;
