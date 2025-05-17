import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import axios from "axios";

const RechargeHistory = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [historys, setHistorys] = useState([]);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const number = localStorage.getItem("mobile");
        const userResp = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${number}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rechargeResp = await axios.get(
          `${import.meta.env.VITE_API_URL}/recharge/history/${
            userResp.data.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHistorys(rechargeResp.data);
      } catch (error) {
        console.error("Failed to fetch recharge history", error);
      }
    };

    loadResults();
  }, [token]);

  const isExpired = (expireDate) => {
    const today = new Date();
    const expDate = new Date(expireDate);
    today.setHours(0, 0, 0, 0);
    expDate.setHours(0, 0, 0, 0);
    return expDate < today;
  };

  const handleButtClick = () => {
    navigate("/plans");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="py-6 text-white text-center bg-blue-600">
        <h1 className="text-2xl font-bold">Recharge History</h1>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleButtClick}
            className="bg-white text-blue-600 px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
          >
            Recharge Plans
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-t-lg px-4 py-6 grow shadow-sm">
        <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_50px] gap-4 font-medium text-gray-700 text-center pb-3 border-b border-gray-200">
          <div>Plan Name</div>
          <div>Payment Mode</div>
          <div>Recharged Date</div>
          <div>Expired Date</div>
          <div>Status</div>
        </div>

        {historys.length === 0 ? (
          <div className="text-center text-gray-600 font-medium mt-6">
            No recharge history found.
          </div>
        ) : (
          historys.map((history) => (
            <div
              key={history.id}
              className="my-3 p-4 rounded-md bg-gray-50 flex flex-col sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr_50px] gap-4 items-center text-center sm:text-left border border-gray-200"
            >
              <div className="text-sm font-medium text-center">
                {history.plan.name}
              </div>
              <div className="text-sm text-center">{history.paymentMethod}</div>
              <div className="text-sm text-center">
                {new Date(history.rechargeDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-center">
                {new Date(history.expiredDate).toLocaleDateString()}
              </div>
              <div
                className={`flex  justify-center items-center w-7 h-7 rounded-full ${
                  isExpired(history.expiredDate) ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {isExpired(history.expiredDate) ? (
                  <ImCross className="text-white text-xs" />
                ) : (
                  <TiTick className="text-white text-sm" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RechargeHistory;
