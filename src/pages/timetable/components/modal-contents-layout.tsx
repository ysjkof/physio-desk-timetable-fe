import { useReactiveVar } from "@apollo/client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { selectedClinicVar } from "../../../store";

interface ModalContentLayoutProps {
  title: string;
  children: ReactNode;
  closeAction: () => void;
}
// create-patient, reservation-card, reserve-card에 공통 레이아웃
export const ModalContentsLayout = ({
  title,
  children,
  closeAction,
}: ModalContentLayoutProps) => {
  const selectedClinic = useReactiveVar(selectedClinicVar);
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={false}
        className="modal-content"
      >
        <button
          className="absolute right-6 top-5"
          onClick={() => closeAction()}
        >
          <FontAwesomeIcon icon={faXmark} fontSize={14} />
        </button>
        <div className="w-full text-base font-semibold">
          {title}
          {selectedClinic.name && (
            <span className="ml-3 text-xs">{selectedClinic.name}</span>
          )}
        </div>
        {children}
      </motion.div>
    </>
  );
};
