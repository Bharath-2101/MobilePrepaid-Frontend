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
    cateogry: "",
    price: "",
    validityInDays: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(`${name}: ${value}`);
  };

  const handleLogClick = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://ec2-3-109-154-195.ap-south-1.compute.amazonaws.com:8080/admin/plans",
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
    <div className="min-h-screen bg-orange-500 px-4 sm:px-10 py-6">
      <div className="flex items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Add New Plan
        </h1>
        <button
          onClick={() => handleLogClick()}
          className="bg-black text-white ml-auto text-sm sm:text-lg px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
        >
          Log Out
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <PiNewspaperClippingDuotone className="h-10 w-10 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-700">
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
                  onChange={(e) => handleChange(e)}
                  value={form.name}
                  className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Enter plan name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  onChange={(e) => handleChange(e)}
                  value={form.category}
                  className="w-full p-2 pr-8 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
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
                  onChange={(e) => handleChange(e)}
                  value={form.price}
                  className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Enter plan price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity (in Days) *
                </label>
                <input
                  type="number"
                  name="validityInDays"
                  onChange={(e) => handleChange(e)}
                  value={form.validityInDays}
                  className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Enter validity in days"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black text-white text-sm sm:text-lg px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
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
