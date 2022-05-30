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
    <div className="modal fixed top-0 left-0 z-40 h-full w-full">
      <div
        className={`modal-background absolute h-full w-full ${
          top ?? "bg-black opacity-50"
        }`}
        onClick={() => closeAction(false)}
      />
      <div
        className={`modal-content relative flex w-fit flex-col ${
          top ?? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        }`}
        style={{ ...(top && { top, left }) }}
      >
        {children}
      </div>
    </div>,
    container
  );
};
