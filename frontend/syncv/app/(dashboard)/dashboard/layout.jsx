"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // State pentru hover și animații
  const [hoveredButton, setHoveredButton] = useState(null);
  const [prevPath, setPrevPath] = useState(pathname);
  const [scrollY, setScrollY] = useState(0);

  // Update direction and scroll position for animations
  const perspectiveDirection = scrollY > 50 ? "up" : "down";

  useEffect(() => {
    setPrevPath(pathname);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Determină ce buton este activ bazat pe pathname
  const isActive = (path) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && pathname.includes(path)) {
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Configurare butoane pentru consistență
  const buttons = [
    {
      id: "dashboard",
      path: "/dashboard",
      href: "/dashboard",
      icon: "/svgs/dashboard.svg",
      label: "Dashboard",
    },
    {
      id: "jd",
      path: "/dashboard/jd",
      href: "/dashboard/jd",
      icon: "/svgs/jd.svg",
      label: "JD Manager",
    },
    {
      id: "cv",
      path: "/dashboard/cv",
      href: "/dashboard/cv",
      icon: "/svgs/cv.svg",
      label: "CV Manager",
    },
    {
      id: "logout",
      path: null,
      icon: "/svgs/logout.svg",
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  // Calculăm lățimea maximă pentru a asigura consistența
  const maxLabelWidth = 120; // O valoare fixă care să acomodeze cel mai lung text (JD Manager)

  // Perspective Animation Variants
  const perspectiveVariants = {
    initial: {
      opacity: 0,
      rotateX: perspectiveDirection === "up" ? -5 : 5,
      scale: 0.96,
      y: perspectiveDirection === "up" ? 20 : -20,
      transformPerspective: 1000,
      transformOrigin: "center center",
    },
    animate: {
      opacity: 1,
      rotateX: 0,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      rotateX: perspectiveDirection === "up" ? 5 : -5,
      scale: 0.98,
      y: perspectiveDirection === "up" ? -20 : 20,
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  // Element variants for staggered children
  const elementVariants = {
    initial: {
      opacity: 0,
      y: 15,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="w-full min-h-screen">
      {/* Bara neagră din stânga */}
      <div className="bg-black h-screen fixed left-0 w-[calc(((100%-260px)/12)+20px)]"></div>

      {/* Conținutul principal cu animație de tranziție */}
      <div className="ml-[calc(((100%-260px)/12)+20px+24px+20px)] pt-[5vh] pr-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={perspectiveDirection}>
          <motion.div
            key={pathname}
            custom={perspectiveDirection}
            variants={perspectiveVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full transform-gpu"
          >
            {/* Wrapper for child elements to enable staggered animations */}
            <motion.div variants={elementVariants}>{children}</motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bara de navigare accent - mutată după conținut pentru a fi sigur că este deasupra */}
      <div className="bg-accent h-[40%] top-[25%] fixed left-[calc((((100%-260px)/12)+20px)/1.45)] w-24 rounded-sm flex flex-col items-center  justify-around z-[1000]">
        {buttons.map((button) => {
          const active = button.path ? isActive(button.path) : false;
          const isHovered = hoveredButton === button.id;

          // Determinăm componenta corectă (Link sau div)
          const ButtonComponent = button.onClick ? "div" : Link;
          const buttonProps = button.onClick
            ? { onClick: button.onClick }
            : { href: button.href };

          return (
            <div key={button.id} className="relative">
              {/* Extinderea butonului - poziționată absolut și în spatele butonului principal */}
              <AnimatePresence>
                {isHovered && !active && (
                  <motion.div
                    className="absolute left-0 top-0 bg-accent h-12 rounded-md overflow-hidden flex pointer-events-none"
                    initial={{ width: 48 }}
                    animate={{ width: 48 + maxLabelWidth }} // Lățime fixă pentru consistență
                    exit={{ width: 48 }}
                    transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                    style={{ zIndex: -1 }}
                  >
                    {/* Placeholder pentru iconiță pentru a asigura poziționarea corectă a textului */}
                    <div className="w-12 flex-shrink-0"></div>

                    {/* Container pentru text cu tranziții separate */}
                    <motion.div
                      className="flex items-center pr-4 h-full justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, delay: 0.05 }}
                    >
                      <span className="whitespace-nowrap text-black body-small">
                        {button.label}
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Butonul principal - mereu vizibil */}
              <ButtonComponent
                {...buttonProps}
                className={`w-12 h-12 flex items-center justify-center rounded-md z-10 relative ${
                  active
                    ? "bg-black shadow-md transform scale-110"
                    : "hover:bg-black/10"
                } transition-all duration-300`}
                onMouseEnter={() => setHoveredButton(button.id)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <img
                  src={button.icon}
                  alt={button.label}
                  className={`w-6 h-6 transition-transform ${
                    active ? "scale-110 filter invert brightness-200" : ""
                  }`}
                />
              </ButtonComponent>
            </div>
          );
        })}
      </div>
    </div>
  );
}
