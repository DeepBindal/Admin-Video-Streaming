import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";

function About() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useContext(Context);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
    const fetchUser = async () => {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}auth/user/${user._id}`
      );
      const res = await response.json();
      setData(res.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <>
      {loading ? (
        <Spinner className="flex items-center justify-center"/>
      ) : (
        <div className="p-4 w-full max-w-lg mx-auto bg-gray-800 rounded-lg shadow-md text-gray-300">
          <div className="flex flex-col items-center sm:flex-row sm:items-start">
            <img
              src={data?.image}
              alt={`${data?.username}'s profile`}
              className="w-32 h-32 rounded-full shadow-lg mb-4 sm:mb-0 sm:mr-6"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold mb-2">{data?.username}</h2>
              <p className="text-gray-400 mb-2">{data?.email}</p>
              <p className="mb-2">
                {data?.firstName} {data?.lastName}
              </p>
              <p className="text-sm text-gray-400">
                Videos Uploaded: {data?.videos}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default About;
