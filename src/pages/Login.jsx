import React, { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mobile: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(`${name}: ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://ec2-3-109-154-195.ap-south-1.compute.amazonaws.com:8080/auth/login",
        form
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("mobile", response.data.mobile);
      console.log(response.data);

      showToast("Login Successful", "green");
      if (response.data.role === "ADMIN") navigate("/admin");
      else navigate("/recharge");
    } catch (error) {
      console.error("Login failed:", error);
      showToast(
        "Login failed: " + (error.response?.data || "Unknown error"),
        "red"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-100 px-4">
      <div className="bg-white sm:w-4/5 md:w-2/3 lg:w-2/5 xl:w-2/5 p-6 rounded-3xl shadow-2xl flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-orange-400">
            Welcome To Mobicharge
          </h1>
          <hr className="mt-2 border-t-2 border-black w-3/4 mx-auto" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm sm:text-base font-bold text-gray-700">
              Enter the Registered Number
            </label>
            <div className="flex gap-2 w-full">
              <input
                type="text"
                value="+91"
                className="w-1/5 bg-gray-300 rounded-md text-center text-black text-sm sm:text-base font-bold"
                disabled
                maxLength="3"
              />
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="flex-1 border border-black rounded-md text-center text-sm h-9 sm:text-base font-bold placeholder-gray-700 focus:border-2"
                placeholder="123 XXXX 890"
                maxLength="10"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm sm:text-base font-bold text-gray-700">
              Your Email:
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full border border-black h-10 rounded-md text-center text-sm sm:text-base font-bold placeholder-gray-700 focus:border-2"
              placeholder="user@gmail.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm sm:text-base font-bold text-gray-700">
              Password:
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full border border-black h-10 rounded-md text-center text-sm sm:text-base font-bold placeholder-gray-700 focus:border-2"
              placeholder="XXXXXXXX"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-orange-400 rounded-lg font-black text-base sm:text-lg px-6 py-2 mt-2 text-gray-800 w-full sm:w-1/2 hover:scale-105 transition-transform shadow-xl"
            >
              Continue
            </button>
          </div>
        </form>

        <div className="text-center text-sm sm:text-base">
          New User?{" "}
          <a
            href="/register"
            className="text-orange-600 font-bold hover:underline"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
