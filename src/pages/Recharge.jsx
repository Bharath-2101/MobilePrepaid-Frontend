import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import "../styles/recharge.css";

const Recharge = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");
  const userMobile = localStorage.getItem("mobile");

  // Fetch all plans initially
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("http://localhost:8080/plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    showToast("Logged out successfully", "green");
  };

  // Plan selection logic
  const handlePlanClick = (e) => {
    const planDiv = e.currentTarget;
    const planName = planDiv.querySelector("span")?.textContent;
    const price = planDiv.querySelector("button")?.textContent;

    showToast(`You selected ${planName}`, "green");
    document
      .querySelectorAll(".amount")
      .forEach((el) => (el.textContent = price));
    document.getElementById("plan").textContent = planName;
  };

  const handleSubmitRecharge = async (e) => {
    e.preventDefault();

    const planName = document.getElementById("plan").textContent;
    const selectedMethod = document.querySelector(
      'input[name="rechargeType"]:checked'
    )?.value;

    if (!planName || !selectedMethod) {
      showToast("Please select a plan and payment method", "red");
      return;
    }

    try {
      const userRes = await axios.get(
        `http://localhost:8080/users/${userMobile}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const planRes = await axios.get("http://localhost:8080/plans/search", {
        params: { value: planName },
        headers: { Authorization: `Bearer ${token}` },
      });

      const userId = userRes.data.id;
      const planId = planRes.data[0].id;

      const response = await axios.post(
        "http://localhost:8080/recharge",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            userId,
            planId,
            paymentMethod: selectedMethod,
          },
        }
      );

      if (response.data === "Recharge successful!") {
        showToast(response.data, "green");
        setTimeout(() => location.reload(), 2000);
      }
    } catch (error) {
      showToast("Recharge failed!", "red");
      console.error("Recharge error:", error);
    }
  };

  const handleProceed = () => {
    document.querySelector(".main").classList.add("blured");
    document.querySelector(".pop").classList.remove("hide");
  };

  const handleCategoryClick = async (e) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/plans/search?value=${e.target.value}`,
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
    <div>
      <div className="main min-h-screen bg-orange-500">
        <div className="h-40 sm:h-56 w-full flex flex-col justify-center items-center font-black text-white relative">
          <h1 className="text-xl sm:text-4xl">RECHARGE PLANS</h1>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate("/rechargehistory")}
              className="bg-black text-sm sm:text-lg p-2 sm:p-3 rounded-lg sm:rounded-2xl"
            >
              Recharge history
            </button>
            <button
              onClick={handleLogout}
              className="bg-black text-sm sm:text-lg p-2 sm:p-3 rounded-lg sm:rounded-2xl"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mt-0 sm:mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
            <h2 className="text-md sm:text-xl font-black text-center">
              Mobile Recharge
            </h2>
            <div className="text-md sm:text-lg font-semibold flex gap-2 px-2">
              <input type="radio" name="type" id="prepaid" checked readOnly />
              <label htmlFor="prepaid">Prepaid</label>
            </div>
            <div className="text-md sm:text-lg font-bold px-2 flex gap-3">
              Name: <p className="font-normal">{userName}</p>
            </div>
            <div className="text-md sm:text-lg font-bold px-2 flex gap-3">
              Number: <p className="font-normal">{userMobile}</p>
            </div>
            <div className="text-md sm:text-lg font-bold px-2 flex gap-3">
              Amount: <p className="amount font-normal"></p>
            </div>
            <button
              onClick={handleProceed}
              className="bg-orange-400 rounded-lg font-black text-md sm:text-xl px-2 py-1 mt-3 text-gray-800 mb-4 w-1/2 sm:w-3/4 md:w-1/2 hover:scale-110 shadow-xl mx-auto"
            >
              Proceed
            </button>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md text-center">
            <div className="flex justify-evenly pb-4">
              {["POPULAR", "UNLIMITED", "DATA"].map((type) => (
                <button
                  key={type}
                  onClick={handleCategoryClick}
                  className="cursor-pointer text-sm sm:text-xl font-black"
                  value={type}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="h-[280px] overflow-y-auto w-full flex flex-col gap-4 pr-2">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={handlePlanClick}
                  className="flex flex-wrap md:flex-nowrap items-center justify-between gap-5 py-2 text-sm sm:text-lg border rounded-xl px-4 cursor-pointer"
                >
                  <span className="min-w-[100px] font-medium">{plan.name}</span>
                  <span className="flex-1 text-gray-600">
                    {plan.description}
                  </span>
                  <span className="text-sm text-gray-500">
                    Validity: {plan.validityInDays} days
                  </span>
                  <button className="border-2 px-4 py-2 rounded-xl whitespace-nowrap">
                    Rs.{plan.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hide pop min-h-screen">
        <div className="pops proceed flex flex-col gap-4">
          <h1 className="text-lg sm:text-2xl font-black text-orange-500">
            RECHARGE
          </h1>
          <p className="text-md sm:text-lg font-bold px-2">
            Name: <span className="font-normal">{userName}</span>
          </p>
          <p className="text-md sm:text-lg font-bold px-2">
            Number: <span className="font-normal">{userMobile}</span>
          </p>
          <p className="text-sm sm:text-lg font-bold px-2">
            Plan: <span className="font-normal" id="plan"></span>
          </p>
          <p className="text-md sm:text-lg font-bold px-2">
            Amount: <span className="amount font-normal"></span>
          </p>

          <form
            onSubmit={handleSubmitRecharge}
            className="flex flex-col sm:gap-3"
          >
            <div className="flex flex-row gap-3">
              {["UPI", "CREDIT_CARD", "DEBIT_CARD"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-2 font-bold"
                >
                  <input type="radio" name="rechargeType" value={method} />
                  {method.replace("_", " ")}
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="bg-orange-400 rounded-lg font-black text-md sm:text-xl px-2 py-1 mt-3 text-gray-800 mb-4 w-1/2 sm:w-3/4 md:w-1/2 hover:scale-110 shadow-xl mx-auto"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recharge;
