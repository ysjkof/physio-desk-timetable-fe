import { useEffect, useRef } from 'react';
import { setAlert, useStore } from '../store';
import Modal from './Modal';
import type { AlertProps, CloseAction } from '../types/props.types';

export default function Alert() {
  const alertState = useStore((state) => state.alert);

  const closeToast = () => {
    setAlert(undefined);
  };

  if (!alertState) return null;

  const { messages } = alertState;

  return (
    <Modal closeAction={closeToast}>
      <AlertBody closeAction={closeToast} messages={messages} />
    </Modal>
  );
}

const AlertBody = ({ closeAction, messages }: AlertProps & CloseAction) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  return (
    <div className="flex w-96 flex-col items-center py-8">
      <div className="flex flex-col items-center justify-center text-lg text-[#34355B]">
        {messages.map(
          (message) => message && <span key={message}>{message}</span>
        )}
      </div>
      <div className="mt-5 flex gap-4 text-base">
        <button
          type="button"
          className="css_default-button w-36 bg-[#E4E4E4] text-[#5E5A5A]"
          onClick={closeAction}
          ref={closeBtnRef}
        >
          창 닫기
        </button>
      </div>
    </div>
  );
};
