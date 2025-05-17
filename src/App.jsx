import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RechargeHistory from "./pages/RechargeHistory";
import Admin from "./pages/Admin";
import UserHistory from "./pages/UserHistory";
import AddPlan from "./pages/AddPlan";
import Plans from "./pages/Plans";
import Recharge from "./pages/Recharge";
import Sucess from "./pages/Success";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rechargehistory" element={<RechargeHistory />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/userhistory/:mobile" element={<UserHistory />} />
          <Route path="/admin/addplan" element={<AddPlan />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/success" element={<Sucess />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
