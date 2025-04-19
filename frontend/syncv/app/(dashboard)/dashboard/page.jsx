"use client";
import React from "react";
import { useAuth } from "../../../context/AuthContext";
import Layout from "../../../components/layout/Layout";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className=" h-[90vh] w-full bg-black flex justify-center items-center h1 text-white">
      Dashboard
    </div>
  );
};

export default Dashboard;
