import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ModalTemplateProps {
  children: ReactNode;
  onClick: () => void;
  top?: number;
  left?: number;
}
export const ModalTemplate = ({
  children,
  onClick,
  top,
  left,
}: ModalTemplateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className={`modal-parents${
        top ? "" : " flex items-center justify-center"
      }`}
    >
      <div
        className={`modal-background ${
          top ? "bg-transparent opacity-100" : ""
        }`}
        // @ts-ignore
        onClick={() => onClick(false)}
      />
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={false}
        className={`${top ? "relative" : "modal-content"}`}
        style={{ ...(top && { top, left }) }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
