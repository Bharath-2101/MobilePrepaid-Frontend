import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import axios from "axios";

const Recharge = () => {
  const [plan, setPlan] = useState({});
  const [spin, setSpin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [isCard, setIsCard] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const planId = queryParams.get("planId");

  const [form, setForm] = useState({
    userId: localStorage.getItem("userId"),
    planId: planId,
    paymentMethod: "UPI",
    paymentDetails: "",
  });

  useEffect(() => {
    const loadPlan = async () => {
      if (!planId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/plans/${planId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlan(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plan:", error);
        showToast("Failed to load plan details", "red");
        setLoading(false);
      }
    };

    loadPlan();
  }, [planId, token]);

  useEffect(() => {
    if (plan?.name && plan?.amount) {
      setForm((prevForm) => ({
        ...prevForm,
        planName: plan.name,
        amount: plan.price,
      }));
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value == "UPI") {
      setIsCard(false);
    } else {
      setIsCard(true);
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleInChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.paymentMethod) {
      showToast("Please select a payment method", "red");
      return;
    }

    setSpin(true);
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/recharge`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId: form.userId,
          planId: form.planId,
          paymentMethod: form.paymentMethod,
          paymentDetails: form.paymentDetails,
        },
      }
    );

    if (response.data != null) {
      showToast("Recharge successful!", "green");
      navigate("/success", {
        state: {
          data: response.data,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading plan details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Mobile Recharge
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={localStorage.getItem("name")}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <input
                type="text"
                name="mobile"
                value={localStorage.getItem("mobile")}
                readOnly
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 bg-gray-100 cursor-not-allowed"
                maxLength="10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              name="planName"
              value={plan.name}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={plan.price}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <div className="space-y-2">
              {["UPI", "CREDIT_CARD", "DEBIT_CARD"].map((method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    onChange={handleChange}
                    checked={form.paymentMethod === method}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{method.replace("_", " ")}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Details
            </label>
            <input
              type="text"
              name="paymentDetails"
              onChange={handleInChange}
              value={form.paymentDetails}
              placeholder={
                isCard ? "Enter Your Card number" : "Enter Your UPI Id"
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className={`${isCard ? " " : "hidden"} space-y-4`}>
            <div>
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiry Date *
              </label>
              <input
                type="month"
                id="expiryDate"
                name="expiryDate"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CVV *
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                maxLength="3"
                pattern="\d{3}"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
          >
            Proceed to Pay
          </button>
        </form>
      </div>
      {spin && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100 bg-opacity-30">
          <div
            className="w-20 h-20 border-4 border-blue-500 border-dashed rounded-full animate-spin"
            style={{ animationDuration: "6s" }}
          ></div>
          <p className="mt-4 text-gray-900 text-lg animate-bounce">
            On Processing...
          </p>
        </div>
      )}
    </div>
  );
};

export default Recharge;
