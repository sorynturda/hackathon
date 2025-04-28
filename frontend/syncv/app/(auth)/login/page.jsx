"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();

  const titleVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.3 + index * 0.15 },
    }),
  };

  const circleVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { duration: 0.8, delay: 1.2 } },
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="flex h-screen relative overflow-hidden">
        <div className="hidden md:block md:w-[calc((((100%-260px)/12*8)+(9*20px)))] h-screen relative bg-white">
          <motion.div
            className="h1 text-black pl-[20px] mt-[20vh]"
            initial="initial"
            animate="animate"
            variants={titleVariants}
          >
            Welcome Back
          </motion.div>
          <motion.div
            className="ml-[calc((((100%-260px)/12*3)+(4*20px)))] w-[calc((((100%-260px)/12*4)+(4*20px)))] mt-[10vh] text-black body-small border-t border-black pt-2"
            initial="initial"
            animate="animate"
            custom={0}
            variants={formVariants}
          >
            Access your account to continue matching top talent with the right
            opportunities. Your recruitment insights are just one click away.
          </motion.div>
          <motion.div
            className="fixed bottom-[-10%] left-[-5%] rounded-full aspect-square bg-accent w-[15vw]"
            initial="initial"
            animate="animate"
            variants={circleVariants}
          ></motion.div>
        </div>

        {/* Right Side - Full width on mobile */}
        <div className="w-full md:flex-1 h-screen bg-black text-white">
          <div className="w-full h-full flex flex-col items-center justify-center px-8">
            <motion.div
              className="h3 text-white mb-8"
              initial="initial"
              animate="animate"
              variants={titleVariants}
            >
              Log In
            </motion.div>

            {error && (
              <motion.div
                className="w-full max-w-xs bg-red/10 border border-red text-white p-3 mb-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            <form
              className="w-full max-w-xs flex flex-col gap-6"
              onSubmit={handleSubmit}
            >
              <motion.div
                className="flex flex-col gap-2"
                initial="initial"
                animate="animate"
                custom={0}
                variants={formVariants}
              >
                <label className="body" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white/50 pb-2 outline-none body focus:border-white"
                  required
                />
              </motion.div>

              <motion.div
                className="flex flex-col gap-2"
                initial="initial"
                animate="animate"
                custom={1}
                variants={formVariants}
              >
                <label className="body" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent border-b border-white/50 pb-2 outline-none body focus:border-white"
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className={`bg-accent text-black body py-3 mt-6 hover:bg-black hover:text-white transition-colors duration-300 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                initial="initial"
                animate="animate"
                custom={2}
                variants={formVariants}
              >
                {loading ? "LOGGING IN..." : "LOG IN"}
              </motion.button>

              <motion.div
                className="flex justify-center items-center mt-4"
                initial="initial"
                animate="animate"
                custom={3}
                variants={formVariants}
              >
                <p className="body text-white/70">Don't have an account? </p>
                <a
                  href="/signup"
                  className="body text-accent ml-2 hover:underline"
                >
                  Sign Up
                </a>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
