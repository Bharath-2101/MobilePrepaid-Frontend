import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { showToast } from "../utils/toast";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    role: "USER",
  });

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

    if (
      form.mobile.length !== 10 ||
      !form.email.includes("@") ||
      form.password.length < 4 ||
      form.name.trim() === ""
    ) {
      showToast("Please fill all fields correctly", "red");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        form
      );

      if (response.status === 200) {
        showToast("Registration Successful!", "green");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      showToast("User already exists or server error", "red");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-0 bg-gray-50">
      <div className="bg-white w-full sm:w-4/5 md:w-2/3 lg:w-2/5 xl:w-2/5 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-center items-center gap-5">
        <div className="text-center w-full">
          <h1 className="text-xl sm:text-3xl font-extrabold text-orange-500">
            Create Your Mobicharge Account
          </h1>
          <hr className="mt-2 border-t-2 border-black w-1/2 mx-auto" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-6 items-center"
        >
          {/* Mobile number input */}
          <div className="flex w-full gap-3 items-center justify-center">
            <input
              type="text"
              value="+91"
              disabled
              className="w-1/5 sm:w-1/6 bg-gray-300 text-black rounded-md text-center font-bold text-sm sm:text-lg"
            />
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="123 XXXX 890"
              maxLength="10"
              required
              className="w-4/5 border border-black rounded-md text-center text-sm sm:text-lg font-bold placeholder-gray-700 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Name input */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            <label className="w-full sm:w-1/4 text-sm sm:text-lg font-bold text-gray-700 text-center sm:text-left">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full sm:w-3/4 border border-black rounded-md text-center text-sm sm:text-lg font-bold placeholder-gray-700 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Email input */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            <label className="w-full sm:w-1/4 text-sm sm:text-lg font-bold text-gray-700 text-center sm:text-left">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              className="w-full sm:w-3/4 border border-black rounded-md text-center text-sm sm:text-lg font-bold placeholder-gray-700 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password input */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            <label className="w-full sm:w-1/4 text-sm sm:text-lg font-bold text-gray-700 text-center sm:text-left">
              Password:
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full sm:w-3/4 border border-black rounded-md text-center text-sm sm:text-lg font-bold placeholder-gray-700 h-9 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-orange-400 text-gray-800 font-extrabold text-lg sm:text-xl rounded-lg px-6 py-2 mt-2 hover:scale-105 transition-transform shadow-md"
          >
            Register
          </button>
        </form>

        {/* Navigation link */}
        <div className="text-center text-sm sm:text-base">
          Already have an account?{" "}
          <a href="/" className="text-orange-500 font-semibold underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
