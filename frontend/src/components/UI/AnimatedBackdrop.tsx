//animated color on background used on login and regiester page
import React from "react";
import { motion } from "framer-motion";

interface AnimatedBackdropProps {
  variant?: "dark" | "light"; // defaults to "dark" if not passed
}
//Animated Config 
//returns Framer Motion keyframe animation fpr each blob,each blob gets diff duration so move independently

const orbAnimation = (duration: number) => ({
  x: [0, 45, -35, 0], //right 45px --> left 35px → bac
  y: [0, -30, 20, 0],// up 30px --> down 20px -->black 
  scale: [1, 1.12, 0.92, 1], // grow >> shrink >> normal
  rotate: [0, 8, -8, 0],     // tilt right >> left >> center
  transition: {
    duration,
    repeat: Infinity,       
    ease: "easeInOut" as const, 
  },
});

const AnimatedBackdrop: React.FC<AnimatedBackdropProps> = ({
  variant = "dark",
}) => {
  const isDark = variant === "dark";

  return (
    // Fills entire parent — parent must have position: relative
    // overflow-hidden clips blobs that extend outside viewport
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* BLOB 1 — top left, sky blue, 15 second loop */}
      <motion.div
        animate={orbAnimation(15)}
        className={`absolute -left-24 -top-16 h-72 w-72 rounded-full blur-3xl ${
          isDark ? "bg-sky-500/30" : "bg-sky-300/45"
        }`}
      />

      {/* BLOB 2 — top right, cyan, 18 second loop */}
      <motion.div
        animate={orbAnimation(18)}
        className={`absolute right-[-90px] top-1/4 h-80 w-80 rounded-full blur-3xl ${
          isDark ? "bg-cyan-400/25" : "bg-cyan-200/55"
        }`}
      />

      {/* BLOB 3 — bottom center, amber accent, 20 second loop */}
      <motion.div
        animate={orbAnimation(20)}
        className={`absolute bottom-[-120px] left-1/3 h-96 w-96 rounded-full blur-3xl ${
          isDark ? "bg-amber-400/20" : "bg-amber-200/55"
        }`}
      />
    </div>
  );
};

export default AnimatedBackdrop;
