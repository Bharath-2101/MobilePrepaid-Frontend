import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recharge from "./pages/Recharge";
import RechargeHistory from "./pages/RechargeHistory";
import Admin from "./pages/Admin";
import UserHistory from "./pages/UserHistory";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rechargehistory" element={<RechargeHistory />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/userhistory/:mobile" element={<UserHistory />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
