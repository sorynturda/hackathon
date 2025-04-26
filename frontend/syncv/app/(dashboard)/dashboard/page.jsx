"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useApiClient } from "../../../lib/api";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const { getApiClient } = useApiClient();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const api = await getApiClient();
        // Replace with your actual user profile endpoint
        const response = await api.get("/api/users/profile");
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    // Uncomment this when your endpoint is ready
    // fetchUserData();

    // For testing purposes until the backend endpoint is available
    setTimeout(() => {
      setUserData({
        username: user?.email?.split("@")[0] || "User",
        email: user?.email,
        role: "Recruiter",
        lastLogin: new Date().toISOString(),
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  return (
    <div className="w-full min-h-screen pt-[15vh]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg"
        >
          <h1 className="h2 text-black mb-6">Dashboard</h1>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="body text-red py-4">{error}</div>
          ) : (
            <>
              <div className="body text-black mb-4">
                Welcome back,{" "}
                <span className="font-bold">
                  {userData?.username || user?.email}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-8">
                <motion.div
                  className="bg-black text-white p-6 rounded-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="h3 mb-3">Profile Information</h3>
                  <ul className="body-small space-y-2">
                    <li>Email: {userData?.email}</li>
                    <li>Role: {userData?.role}</li>
                    <li>
                      Last Login:{" "}
                      {new Date(userData?.lastLogin).toLocaleString()}
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  className="bg-accent p-6 rounded-md"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="h3 text-black mb-3">Next Steps</h3>
                  <p className="body-small text-black mb-4">
                    Explore our AI-powered CV matching features and start
                    finding the perfect candidates.
                  </p>
                  <ul className="body-small text-black space-y-2 list-disc pl-5">
                    <li>Upload your job descriptions</li>
                    <li>Import candidate CVs</li>
                    <li>Review AI-generated matches</li>
                    <li>Schedule interviews with top candidates</li>
                  </ul>
                </motion.div>
              </div>

              <motion.div
                className="mt-8 border-t border-black/10 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="h3 text-black mb-3">Recent Activity</h3>
                <p className="body-small">
                  Your account is now connected with our secure authentication
                  system. Use the navigation above to explore the features
                  available to you.
                </p>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
