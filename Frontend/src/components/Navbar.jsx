import React, { useContext } from "react";
import {
  Button,
  Avatar,
} from "@nextui-org/react";
import { Context } from "../main";
import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser, isAuthenticated, user } = useContext(Context);
  const handleLogout = () => {
    setUser({});
    setIsAuthenticated(false);
    navigate("/auth/login");
  }

  return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-gray-900 px-6 py-3 shadow-lg">
      <Link to="/" className="flex items-center gap-4 text-white">
        <p className="text-2xl font-bold text-light-1 hidden sm:block">
          Logo
        </p>
      </Link>

      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link
              to="/auth/login"
              className="hidden md:inline-block text-white hover:text-gray-300"
            >
              Login
            </Link>
            <Link
              color="primary"
              to="/auth/signup"
              variant="flat"
              className="text-white bg-blue-500 hover:bg-blue-600 rounded-md px-4 py-2"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Avatar
              as={Link}
              to="/about  "
              src={user?.image}
              className="w-10 h-10 rounded-full object-cover"
            />
            <Button
              color="primary"
              onPress={() => handleLogout()}
              variant="flat"
              className="text-white bg-red-500 hover:bg-red-600 rounded-md px-4 py-2"
            >
              Log Out
            </Button>
          </div>
        )}
      </div>
    </nav>  
  );
}
