import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ModalTemplateProps {
  children: ReactNode;
  closeAction: () => void;
  top?: number;
  left?: number;
}

export const ModalTemplate = ({
  children,
  closeAction,
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
        onClick={() => closeAction()}
      />
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={false}
        className={`${
          top
            ? "relative"
            : "modal-content h-full w-[400px] py-4 sm:h-fit sm:min-h-[600px]"
        }`}
        style={{ ...(top && { top, left }) }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
