import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { showToast } from "../utils/toast";

const UserHistory = () => {
  const token = localStorage.getItem("token");
  const { mobile } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const isExpired = (expireDate) => {
    const today = new Date();
    const expDate = new Date(expireDate);
    today.setHours(0, 0, 0, 0);
    expDate.setHours(0, 0, 0, 0);
    return expDate < today;
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const userResp = await axios.get(
          `http://localhost:8080/users/${mobile}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails(userResp.data);

        const historyResp = await axios.get(
          `http://localhost:8080/recharge/history/${userResp.data.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHistory(historyResp.data);
      } catch (error) {
        console.error("Error fetching user history:", error);
        showToast("Failed to load user history", "red");
      } finally {
        setLoading(false);
      }
    };

    fetchUserHistory();
  }, [mobile, token]);

  return (
    <div className="min-h-screen bg-gray-300 px-4 sm:px-10 py-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBackClick}
          className="bg-blue-600 text-white text-sm sm:text-base px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Admin
        </button>
      </div>

      {userDetails && (
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-3 text-gray-800">User Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">
                Name: <span className="font-normal">{userDetails.name}</span>
              </p>
              <p className="font-medium">
                Mobile:{" "}
                <span className="font-normal">{userDetails.mobile}</span>
              </p>
            </div>
            <div>
              <p className="font-medium">
                Email: <span className="font-normal">{userDetails.email}</span>
              </p>
              <p className="font-medium">
                Total Recharges:{" "}
                <span className="font-normal">{history.length}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recharge History</h1>
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No recharge history found for this user.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr_80px] gap-4 border-b pb-3 mb-4 font-medium text-gray-700 text-center text-sm">
              <div>Plan Name</div>
              <div>Payment Mode</div>
              <div>Recharged Date</div>
              <div>Expired Date</div>
              <div>Status</div>
            </div>

            <div className="flex flex-col gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200
                  flex flex-col sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr_80px] gap-3 items-center text-sm"
                >
                  <div className="font-medium text-center sm:text-left">
                    {item.plan.name}
                  </div>
                  <div className="text-center">
                    {item.paymentMethod.replace("_", " ")}
                  </div>
                  <div className="text-center">
                    {new Date(item.rechargeDate).toLocaleDateString()}
                  </div>
                  <div
                    className={`text-center ${
                      isExpired(item.expiredDate)
                        ? "text-red-500 font-medium"
                        : ""
                    }`}
                  >
                    {new Date(item.expiredDate).toLocaleDateString()}
                  </div>
                  <div className="flex justify-center">
                    <div
                      className={`flex justify-center items-center w-6 h-6 rounded-full ${
                        isExpired(item.expiredDate)
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {isExpired(item.expiredDate) ? (
                        <ImCross className="text-white text-xs" />
                      ) : (
                        <TiTick className="text-white text-xs" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserHistory;
