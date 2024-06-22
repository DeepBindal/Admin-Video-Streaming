import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Avatar, Button, Spinner } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(Context);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch(`http://localhost:5000/api/video/${user._id}`);
        const res = await response.json();
        setData(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [user]);

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">My Videos</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.length === 0 ? (
            <div className="flex items-center justify-center text-xl text-gray-500 col-span-full">
              Start uploading videos...
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item._id}
                className="flex flex-col p-4 bg-white rounded-lg shadow-md text-gray-800"
              >
                <div className="flex items-center mb-4">
                  <Avatar
                    size="lg"
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="rounded-md"
                  />
                  <div className="ml-4">
                    <Link
                      to={`/video/${item._id}`}
                      className="text-lg font-medium text-blue-600 hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-600">{item.status}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">
                    Duration: {item.duration < 60 ? `${item.duration} sec` : `${Math.round(item.duration / 60)} min`}
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    Tags: <span className="text-xs text-gray-500">{item.tags.join(", ")}</span>
                  </p>
                </div>
                <Button
                  color="error"
                  size="sm"
                  onClick={() => handleDelete(item._id)}
                  className="self-end"
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:5000/api/user/video/${id}`, {
        method: "DELETE",
      });
      setData(data.filter((video) => video._id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  }
}

export default Home;
