const Video = require("../models/video");
const User = require("../models/user");
const connectToDB = require("../utils/db");

const uploadVideo = async (req, res) => {
  console.log(req.body);
  const {
    title,
    duration,
    description,
    videoUrl,
    imageUrl,
    status,
    tags,
    categories,
    userId,
  } = req.body;
  const arr1 = categories.split(",");
  const arr2 = tags.split(",");
  await connectToDB();
  const user = await User.findById(userId);
  const video = new Video({
      title,
      description,
    url: videoUrl,
    thumbnailUrl: imageUrl,
    tags: arr2,
    categories: arr1,
    uploader: userId,
    duration,
    status,
});

const result = await video.save();
user.videos++;
await user.save();

  res.status(201).json({ message: "VIDEOCREATED", video: result });
};

const fetchUserVideos = async (req, res) => {
  await connectToDB();
  const { userId } = req.params;
  console.log(userId);

  const videos = await Video.find({ uploader: userId });

  res.status(200).json({
    success: true,
    data: videos,
  });
};

const fetchVideo = async (req, res) => {
  await connectToDB();

  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }

  res.status(200).json({ data: video });
};

const changeStatus = async (req, res) => {
  await connectToDB();

  const { videoId } = req.params;
  const { status } = req.body;

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { status },
    { new: true } 
  );

  if (!updatedVideo) {
    return res.status(404).json({ error: "Video not found" });
  }
  res
    .status(200)
    .json({ message: "STATUSCHANGED", data: updatedVideo });
};

const handleDelete = async (req, res) => {
    await connectToDB();

    const { videoId } = req.params;

    const result = await Video.findByIdAndDelete(videoId);
    const user = await User.findById(result.uploader);
    user.videos = user.videos - 1;
    await user.save();
    if (!result) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video deleted successfully" });
}

const updateVideo = async (req, res) => {
    const { videoId } = req.params;
    // Assuming req.body contains the updated video data
    await connectToDB();
    const { title, description, tags, categories, videoUrl, duration, imageUrl, userId } = req.body;

    // Find the existing video by videoId
    let video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update the video fields
    video.title = title;
    video.description = description;
    video.tags = tags.split(',').map(tag => tag.trim());
    video.categories = categories.split(',').map(category => category.trim());
    video.thumbnailUrl = imageUrl;
    video.userId = userId;

    // Save the updated video object
    await video.save();

    // Respond with success message
    res.status(200).json({ message: 'VIDEOUPDATED' });
}

module.exports = { uploadVideo, fetchUserVideos, fetchVideo, changeStatus, handleDelete, updateVideo };
