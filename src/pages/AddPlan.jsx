import React, { useState } from "react";
import { PiNewspaperClippingDuotone } from "react-icons/pi";
import { showToast } from "../utils/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPlan = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    validityInDays: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogClick = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/plans`,
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.data != null) {
      showToast("Plan Added Successfully", "green");
      navigate(-1);
    } else {
      showToast("Something went wrong", "red");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 px-4 sm:px-10 py-6">
      <div className="flex items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Add New Plan
        </h1>
        <button
          onClick={handleLogClick}
          className="bg-blue-600 text-white ml-auto text-sm sm:text-base px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Log Out
        </button>
      </div>
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <PiNewspaperClippingDuotone className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">
                Plan Information
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={form.name}
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter plan name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  onChange={handleChange}
                  value={form.category}
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  <option value="DATA">DATA</option>
                  <option value="POPULAR">POPULAR</option>
                  <option value="UNLIMITED">UNLIMITED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="text"
                  name="price"
                  onChange={handleChange}
                  value={form.price}
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter plan price"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity (in Days) *
                </label>
                <input
                  type="number"
                  name="validityInDays"
                  onChange={handleChange}
                  value={form.validityInDays}
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter validity in days"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white text-sm sm:text-base px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlan;
