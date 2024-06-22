import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import { Context } from "../main";
import toast from "react-hot-toast";

const VideoDetails = () => {
  const { user } = useContext(Context);
  const { id } = useParams();
  const [video, setVideo] = useState();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/video/${id}`
        );
        const data = await response.json();
        setVideo(data.data);
      } catch (error) {
        console.error("Error fetching video details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, []);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/video/${video._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setVideo((prev) => ({
          ...prev,
          status: newStatus,
        }));
      } else {
        console.error("Failed to update video status");
      }
    } catch (error) {
      console.error("Error updating video status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center h-64">
        Video not found
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user/video/${video._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const res = await response.json();
        console.log(res);
        toast.error("Video Deleted");
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center w-full p-4 lg:p-8 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-4xl shadow-lg mb-6">
        <CardHeader className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-center">{video.title}</h1>
          <p className="text-gray-600 text-center mb-4">{video.description}</p>
          <div className="w-full h-60 lg:h-80 overflow-hidden rounded-lg">
            <img
              src={video.thumbnailUrl}
              alt="thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        </CardHeader>
        <CardBody className="w-full">
          <div className="flex flex-wrap justify-between items-center p-4">
            <div className="flex gap-2 items-center">
              <Avatar
                src={user?.image}
                alt={user?.name}
                size="md"
                className="shadow-lg"
              />
              <div>
                <p className="text-lg font-medium">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/video/edit/${video._id}`}>
                <Button variant="flat" color="primary">
                  Edit
                </Button>
              </Link>
              <Button
                variant="flat"
                onClick={() => handleDelete(video._id)}
                color="danger"
              >
                Delete
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="p-4">
          <h2 className="text-2xl font-semibold">Video Details</h2>
        </CardHeader>
        <CardBody className="p-4">
          <Table className="w-full">
            <TableHeader>
              <TableColumn>Likes</TableColumn>
              <TableColumn>Dislikes</TableColumn>
              <TableColumn>Status</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Chip color="success" size="sm">
                    {video.likes}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip color="danger" size="sm">
                    {video.dislikes}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered">{video.status}</Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      onAction={(newStatus) => handleStatusChange(newStatus)}
                      selectedKey={video.status}
                    >
                      <DropdownItem key="Public">Public</DropdownItem>
                      <DropdownItem key="Private">Private</DropdownItem>
                      <DropdownItem key="Unlisted">Unlisted</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Card className="w-full mt-4 max-w-4xl shadow-lg mb-6">
        <CardHeader className="p-4">
          <h2 className="text-2xl font-semibold">Tags and Categories</h2>
        </CardHeader>
        <CardBody className="p-4 flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag, index) => (
                <Chip key={index} color="primary" size="sm">
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {video.categories.map((category, index) => (
                <Chip key={index} color="secondary" size="sm">
                  {category}
                </Chip>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default VideoDetails;
