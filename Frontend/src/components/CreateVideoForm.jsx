import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Context } from "../main";
import { Input, Select, SelectItem } from "@nextui-org/react"; // Assume you have a reusable Input component
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateVideoForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(Context);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  const statusItems = [
    { key: "Public", label: "Public" },
    { key: "Private", label: "Private" },
    { key: "Unlisted", label: "Unlisted" },
  ];

  const [value, setValue] = useState("");
  const [video, setVideo] = useState({});
  const [image, setImage] = useState({ array: [] });
  const [videoProgress, setVideoProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);

  const handleSelectionChange = (e) => setValue(e.target.value);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      categories: "",
    },
  });

  const handleVideoDrop = (files) => {
    setVideoProgress(0);
    const uploaders = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");

      return axios.post(
        "https://api.cloudinary.com/v1_1/dnwxccz0p/video/upload",
        formData,
        {
          headers: { "X-Requested-With": "XMLHttpRequest" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setVideoProgress(percentCompleted);
          },
        }
      ).then((response) => {
        setVideo(response.data);
        setVideoProgress(100);
      });
    });

    axios.all(uploaders);
  };

  const handleImageDrop = (files) => {
    setImageProgress(0);
    const uploaders = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");

      return axios.post(
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
      ).then((response) => {
        setImage((prev) => ({ ...prev, array: [...prev.array, response.data.url] }));
        setImageProgress(100);
      });
    });

    axios.all(uploaders);
  };

  const onSubmit = async (data) => {
    const requestBody = {
      ...data,
      status: value,
      videoUrl: video.secure_url,
      duration: video.duration,
      imageUrl: image.array[0],
      userId: user._id,
    };

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const res = await response.json();
      if (res.message === "VIDEOCREATED") {
        toast.success("Video uploaded successfully");
        navigate("/");
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error("Failed to upload video");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="bg-white p-6 md:p-8 lg:p-10 w-full max-w-3xl rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Post a Video</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Title"
            {...register("title", { required: "Title is required" })}
            id="title"
            isInvalid={!!errors.title}
            errorMessage={errors.title?.message}
            className="w-full"
          />
          <Input
            label="Description"
            {...register("description", { required: "Description is required" })}
            id="description"
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
            className="w-full"
          />
          <Input
            label="Tags (comma separated)"
            {...register("tags")}
            id="tags"
            isInvalid={!!errors.tags}
            errorMessage={errors.tags?.message}
            className="w-full"
          />
          <Input
            label="Categories (comma separated)"
            {...register("categories")}
            id="categories"
            isInvalid={!!errors.categories}
            errorMessage={errors.categories?.message}
            className="w-full"
          />
          <Select
            selectedKeys={[value]}
            onChange={handleSelectionChange}
            label="Status"
            placeholder="Select status"
            className="w-full max-w-xs"
            isInvalid={!!errors.status}
            errorMessage={errors.status?.message}
          >
            {statusItems.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Video Upload</label>
            <Dropzone onDrop={handleVideoDrop}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="bg-gray-50 hover:bg-gray-100 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer text-center"
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-500">Drag & drop your video here, or click to select files</p>
                </div>
              )}
            </Dropzone>
            <div className="mt-2">
              <progress value={videoProgress} max="100" className="w-full"></progress>
              <p className="text-center text-gray-600 mt-1">{videoProgress}%</p>
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Thumbnail Upload</label>
            <Dropzone onDrop={handleImageDrop}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="bg-gray-50 hover:bg-gray-100 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer text-center"
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-500">Drag & drop your thumbnail here, or click to select files</p>
                </div>
              )}
            </Dropzone>
            <div className="mt-2">
              <progress value={imageProgress} max="100" className="w-full"></progress>
              <p className="text-center text-gray-600 mt-1">{imageProgress}%</p>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Upload Video
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateVideoForm;
