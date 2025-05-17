import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || {};
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center">
          <CheckCircle2 className="text-green-500 w-16 h-16 mb-2" />
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
            Recharge Successful
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            you'll be notified via email.
          </p>
        </div>

        <div className="text-sm space-y-7">
          <InfoRow label="Customer Name" value={data.data.user.name} />
          <InfoRow label="Plan Name" value={data.data.plan.name} />
          <InfoRow
            label="Recharged Date"
            value={new Date(data.data.rechargeDate).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          />

          <InfoRow
            label="Payment Method"
            value={data.data.paymentMethod.replace("_", " ")}
          />
          <InfoRow
            label="Payment Details"
            value={
              data.data.paymentDetails.slice(0, -6).replace(/./g, "*") +
              data.data.paymentDetails.slice(-6)
            }
          />
          <InfoRow label="Amount Paid" value={`Rs. ${data.data.plan.price}`} />
        </div>

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/plans")}
        >
          Make another Recharge
        </button>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-1">
    <span className="font-medium text-gray-700">{label}</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default Success;
