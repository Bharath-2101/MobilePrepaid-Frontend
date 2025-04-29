import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

const Admin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(response.data);
      } catch (err) {
        console.error("Failed to fetch expiring users", err);
        showToast("Failed to load data", "red");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token]);

  const handleDivClick = (mobile) => {
    navigate(`/userhistory/${mobile}`);
  };

  const handleClick = () => {
    navigate("/admin/addplan");
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast("Logged out successfully", "green");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-orange-500 px-4 sm:px-10 py-6">
      <div className="flex  items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Admin Dashboard
        </h1>
        <button
          onClick={handleClick}
          className="bg-black text-white ml-auto text-sm sm:text-lg px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-md"
        >
          Add Plan
        </button>
        <button
          onClick={handleLogout}
          className="bg-black text-white text-sm sm:text-lg px-4 py-2 rounded-xl ml-2 sm:ml-5 hover:bg-gray-800 transition-colors shadow-md"
        >
          Log Out
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Expiring Plans
        </h1>
      </div>

      {loading ? (
        <div className="text-center text-white text-lg">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 border-b pb-3 mb-4 font-bold text-gray-700 text-center text-sm sm:text-lg">
            <div>Name</div>
            <div>Plan</div>
            <div>Recharged Date</div>
            <div>Expiry Date</div>
          </div>

          <div className="flex flex-col gap-4">
            {history.length === 0 ? (
              <div className="text-center text-gray-600 text-sm sm:text-base py-4">
                No expiring plans found.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleDivClick(item.user.mobile)}
                  className="cursor-pointer p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors
                  flex flex-col sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr] gap-2 sm:gap-4 text-center text-sm sm:text-base"
                >
                  <div className="font-medium">{item.user.name}</div>
                  <div>{item.plan.name}</div>
                  <div>{new Date(item.rechargeDate).toLocaleDateString()}</div>
                  <div
                    className={
                      new Date(item.expiredDate) < new Date()
                        ? "text-red-500 font-bold"
                        : ""
                    }
                  >
                    {new Date(item.expiredDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
