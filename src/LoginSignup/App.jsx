import React from "react";
import "../index.css";

import Singnup from "./Singnup.jsx";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import Profile from "./Profile.jsx";
import EditProfile from "./EditProfile.jsx";
import Settings from "./Settings.jsx";
import About from "./About.jsx";
import DashboardLayout from "./DashboardLayout.jsx";
import ViewProfile from "./ViewProfile.jsx";
import MyTasks from "./MyTasks.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Signup */}
        <Route path="/" element={<Singnup />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* All dashboard pages use the same static Sidebar */}
        <Route element={<DashboardLayout />}>

          {/* Dashboard */}
          <Route path="/home" element={<Dashboard />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

           {/* My Tasks */}
          <Route path="/tasks" element={<MyTasks />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* About */}
          <Route path="/about" element={<About />} />

          {/* Edit Profile */}
          <Route path="/edit-profile" element={<EditProfile />} />
          {/*View Profile */}
          <Route path="/view-profile" element={<ViewProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;