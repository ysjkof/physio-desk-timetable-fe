import { useEffect, useRef } from 'react';
import { setAlert, useStore } from '../store';
import Modal from './Modal';
import { cls } from '../utils/commonUtils';
import type { AlertProps, CloseAction } from '../types/propsTypes';

export default function Alert() {
  const alertState = useStore((state) => state.alert);

  const closeToast = () => {
    setAlert(undefined);
  };

  if (!alertState) return null;

  const { messages, isPositive } = alertState;

  return (
    <Modal closeAction={closeToast}>
      <AlertBody
        closeAction={closeToast}
        messages={messages}
        isPositive={isPositive}
      />
    </Modal>
  );
}

const AlertBody = ({
  closeAction,
  messages,
  isPositive,
}: AlertProps & CloseAction) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  return (
    <div id="alert">
      <p className="flex flex-col gap-y-2 text-base text-[#34355B] ">
        {messages.map(
          (message) => message && <span key={message}>{message}</span>
        )}
      </p>
      <button
        type="button"
        className={cls(
          'css_default-button w-36 text-base font-medium text-white',
          isPositive ? 'bg-[#6BA6FF]' : 'bg-[#F0817A]'
        )}
        onClick={closeAction}
        ref={closeBtnRef}
      >
        창 닫기
      </button>
    </div>
  );
};
