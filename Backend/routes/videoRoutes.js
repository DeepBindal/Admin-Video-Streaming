const express = require("express");
const asyncHandler = require("../utils/asyncHandler.js");
const {
  uploadVideo,
  fetchUserVideos,
  fetchVideo,
  changeStatus,
  handleDelete,
  updateVideo,
} = require("../controllers/videoController.js");
const router = express.Router();

router.route("/video").post(asyncHandler(uploadVideo));

router.route("/video/:userId").get(asyncHandler(fetchUserVideos));

router
  .route("/user/video/:videoId")
  .get(asyncHandler(fetchVideo))
  .post(asyncHandler(updateVideo))
  .put(asyncHandler(changeStatus))
  .delete(asyncHandler(handleDelete));

module.exports = router;
