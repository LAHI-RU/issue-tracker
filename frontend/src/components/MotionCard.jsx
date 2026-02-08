import { motion } from "framer-motion";

export default function MotionCard({ className = "", children }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
