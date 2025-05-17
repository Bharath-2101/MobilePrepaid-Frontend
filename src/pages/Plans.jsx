import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");
  const userMobile = localStorage.getItem("mobile");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/plans`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    showToast("Logged out successfully", "green");
  };

  const handlePlanClick = (e) => {
    const planDiv = e.currentTarget;
    setSelectedPlanId(planDiv.dataset.id);
    const planName = planDiv.querySelector("span")?.textContent;
    const price = planDiv.querySelector("button")?.textContent;

    showToast(`You selected ${planName}`, "green");
    document
      .querySelectorAll(".amount")
      .forEach((el) => (el.textContent = price));
    document.getElementById("plan").textContent = planName;
  };

  const handleProceed = () => {
    navigate(`/recharge?planId=${selectedPlanId}`);
  };

  const handleCategoryClick = async (e) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/plans/search?value=${e.target.value}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPlans(response.data);
    } catch (err) {
      console.error("Category fetch failed:", err);
      showToast("Failed to fetch plans", "red");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="main">
        <div className="h-40 w-full flex flex-col justify-center items-center font-bold text-white bg-blue-600">
          <h1 className="text-2xl">RECHARGE PLANS</h1>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate("/rechargehistory")}
              className="bg-white text-blue-600 text-sm p-2 rounded-lg"
            >
              Recharge history
            </button>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 text-sm p-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="max-w-7xl bg-gray-300 mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-center mb-4">
              Mobile Recharge
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <input type="radio" name="type" id="prepaid" checked readOnly />
              <label htmlFor="prepaid" className="font-medium">
                Prepaid
              </label>
            </div>
            <div className="mb-3">
              <span className="font-medium">Name: </span>
              <span>{userName}</span>
            </div>
            <div className="mb-3">
              <span className="font-medium">Number: </span>
              <span>{userMobile}</span>
            </div>
            <div className="mb-3">
              <span className="font-medium">Plan: </span>
              <span id="plan"></span>
            </div>
            <div className="mb-6">
              <span className="font-medium">Amount: </span>
              <span className="amount"></span>
            </div>
            <button
              onClick={handleProceed}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
            >
              Proceed
            </button>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-evenly pb-4 border-b border-gray-200">
              {["POPULAR", "UNLIMITED", "DATA"].map((type) => (
                <button
                  key={type}
                  onClick={handleCategoryClick}
                  className="font-medium text-blue-600 hover:text-blue-800"
                  value={type}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="h-[280px] overflow-y-auto mt-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={handlePlanClick}
                  data-id={plan.id}
                  data-name={plan.name}
                  data-price={plan.price}
                  className="flex flex-col sm:flex-row items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <span className="font-medium mb-2 sm:mb-0">{plan.name}</span>
                  <span className="text-gray-600 text-sm text-center flex-1 mx-2">
                    {plan.description}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Validity: {plan.validityInDays} days
                  </span>
                  <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm mt-2 sm:mt-0">
                    Rs.{plan.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
