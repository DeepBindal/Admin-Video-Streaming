import { Input } from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { EyeSlashFilledIcon } from "../assets/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../assets/EyeFilledIcon";
import { Context } from "../main";

const userSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

function Login() {
  const { setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  const loginUser = async (values) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const res = await response.json();
        if (res.message === "USERLOGGED") {
          toast.success("Welcome back!");
          setIsAuthenticated(true);
          setUser(res.user);
          navigate("/");
        } else {
          toast.error(res.message);
        }
      } else {
        toast.error("Failed to log in");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 lg:p-10 max-w-lg w-full">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-600 mt-1">to continue to Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit(loginUser)} className="flex flex-col space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              label="Email"
              {...register("email")}
              id="email"
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email}
              className="w-full"
            />
          </div>
          <div>
            <Input
              id="password"
              {...register("password")}
              label="Password"
              placeholder="Enter your password"
              endContent={
                <button type="button" onClick={toggleVisibility} className="focus:outline-none">
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-gray-400" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-gray-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          No Account?&nbsp;
          <Link to="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
