import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ITimetableProps {
  children: ReactNode;
}

export const TimetableTemplate = ({ children }: ITimetableProps) => {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="timetable-layout-container opacity-0"
    >
      {children}
    </motion.div>
  );
};
