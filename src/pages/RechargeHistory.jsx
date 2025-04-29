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
          `http://localhost:8080/users/${number}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rechargeResp = await axios.get(
          `http://localhost:8080/recharge/history/${userResp.data.id}`,
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
    navigate("/recharge");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col">
      <div className="py-6 sm:py-12 text-white text-center relative">
        <h1 className="text-2xl sm:text-4xl font-black">Recharge History</h1>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleButtClick}
            className="bg-black text-white text-sm sm:text-lg px-5 py-2 sm:px-6 sm:py-3 rounded-lg hover:scale-105 transition-transform"
          >
            Recharge Plans
          </button>
          <button
            onClick={handleLogout}
            className="bg-black text-white text-sm sm:text-lg px-5 py-2 sm:px-6 sm:py-3 rounded-lg hover:scale-105 transition-transform"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl px-4 sm:px-12 py-6 grow">
  
        <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_50px] gap-4 font-bold text-gray-700 text-center pb-3 border-b-2 border-gray-300">
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
              className="my-4 p-4 rounded-xl bg-gray-100 flex flex-col sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr_50px] gap-4 items-center text-center sm:text-left"
            >
              <div className="text-sm sm:text-base font-semibold">
                {history.plan.name}
              </div>
              <div className="text-sm sm:text-base">
                {history.paymentMethod}
              </div>
              <div className="text-sm sm:text-base">
                {new Date(history.rechargeDate).toLocaleDateString()}
              </div>
              <div className="text-sm sm:text-base">
                {new Date(history.expiredDate).toLocaleDateString()}
              </div>
              <div
                className={`flex justify-center items-center w-7 h-7 sm:w-8 sm:h-8 rounded-full ${
                  isExpired(history.expiredDate) ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {isExpired(history.expiredDate) ? (
                  <ImCross className="text-white text-xs sm:text-sm" />
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
