import React from "react";
import { createPortal } from "react-dom";

interface IModalPortal {
  closeAction: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  left?: number;
  top?: number;
}

export const ModalPortal = ({
  closeAction,
  children,
  left,
  top,
}: IModalPortal) => {
  const container = document.getElementById("root") as HTMLElement;

  return createPortal(
    <div className="modal-parents">
      <div
        className={`modal-background ${
          top ? "bg-transparent opacity-100" : ""
        }`}
        onClick={() => closeAction(false)}
      />
      <div
        className={`${top ? "relative" : "modal-content position-center"}`}
        style={{ ...(top && { top, left }) }}
      >
        {children}
      </div>
    </div>,
    container
  );
};
