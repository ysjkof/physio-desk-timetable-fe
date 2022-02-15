import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export const ModalPortal: React.FC = ({ children }) => {
  // const container = document.getElementById("modal-root") as HTMLElement;
  const container = document.getElementById("root") as HTMLElement;
  const navigate = useNavigate();

  return createPortal(
    <div className="modal fixed top-0 left-0 z-20 h-full w-full">
      <div
        className="modal-background absolute z-30 h-full w-full bg-black opacity-50"
        onClick={() => navigate(-1)}
      />
      <div className="modal-content relative top-1/2  left-1/2 z-50 flex w-fit -translate-x-1/2 -translate-y-1/2 flex-col">
        {children}
      </div>
    </div>,
    container
  );
};
