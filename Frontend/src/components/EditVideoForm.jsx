import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../main";

const EditVideoForm = () => {
    const {user} = useContext(Context)
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState({});
  const [image, setImage] = useState({ array: [] });
  const [videoProgress, setVideoProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [data, setData] = useState({});
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [hasVideoChanged, setHasVideoChanged] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    categories: "",
  });

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/video/${id}`);
        const jsonData = await response.json();
        setData(jsonData.data || {});
        setFormData({
          title: jsonData.data?.title || "",
          description: jsonData.data?.description || "",
          tags: jsonData.data?.tags ? jsonData.data.tags.join(",") : "",
          categories: jsonData.data?.categories ? jsonData.data.categories.join(",") : "",
        });
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoDetails();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageDrop = async (files) => {
    setHasImageChanged(true);
    console.log("inside drop");
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "my-uploads");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dnwxccz0p/image/upload",
        formData,
        {
          headers: { "X-Requested-With": "XMLHttpRequest" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImageProgress(percentCompleted);
          },
        }
      );
      const data = response.data;
      setImage({ ...image, array: [data.url] });
      setImageProgress(100); // Mark as completed
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const requestBody = {
        ...formData,
        videoUrl: video.secure_url || "",
        duration: video.duration || "",
        imageUrl: image.array.length > 0 ? image.array[0] : data.thumbnailUrl,
        userId: user._id,
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/user/video/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const res = await response.json();
        if (res.message === "VIDEOUPDATED") {
          toast.success("Video updated successfully");
          navigate(`/video/${id}`);
        } else {
          toast.error(res.message);
        }
      } else {
        toast.error("Failed to update video");
      }
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Failed to update video");
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">Edit video</h1>
      <form
        onSubmit={onSubmit}
        className="space-y-4 p-4 border border-gray-300 w-full rounded-md shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
            Categories (comma separated)
          </label>
          <input
            type="text"
            id="categories"
            name="categories"
            value={formData.categories}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <h1 className="font-semibold text-lg">Thumbnail Upload</h1>
        {!hasImageChanged && <img src={data.thumbnailUrl} height={60} width={150} alt="" />}
        <Dropzone onDrop={handleImageDrop}>
          {({ getRootProps, getInputProps }) => (
            <section className="flex justify-center items-center">
              <div
                {...getRootProps()}
                className="bg-gray-500 hover:bg-gray-400 transition duration-300 ease-in-out p-4 w-full h-full md:h-60 lg:h-20 flex flex-col justify-center items-center text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
              >
                <input {...getInputProps()} />
                <p className="text-white">
                  Drag & drop your Thumbnail here, or click to select files
                </p>
              </div>
            </section>
          )}
        </Dropzone>
        <div className="mt-2">
          <progress
            value={imageProgress}
            max="100"
            className="w-full"
          ></progress>
          <p className="text-center">{imageProgress}%</p>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Update Video
        </button>
      </form>
    </>
  );
};

export default EditVideoForm;
