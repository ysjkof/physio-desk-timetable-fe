import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { setConfirm, useStore } from '../store';
import { ConfirmFormFields } from '../types/form.types';
import { ConfirmProps } from '../types/props.types';
import Modal from './Modal';
import FormError from './FormError';
import Checkbox from './Checkbox';

export default function Confirm() {
  const confirmState = useStore((state) => state.confirm);

  const closeToast = () => {
    setConfirm(undefined);
  };

  if (!confirmState) return null;

  const { buttonText, confirmAction, messages, targetName, icon, hasCheck } =
    confirmState;

  return (
    <Modal closeAction={closeToast}>
      <ConfirmBody
        closeAction={closeToast}
        confirmAction={confirmAction}
        icon={icon}
        hasCheck={hasCheck}
        messages={messages}
        targetName={targetName}
        buttonText={buttonText}
      />
    </Modal>
  );
}

const ConfirmBody = ({
  closeAction,
  confirmAction,
  icon,
  hasCheck,
  messages,
  targetName,
  buttonText,
}: ConfirmProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ConfirmFormFields>({ defaultValues: { agree: !hasCheck } });

  const onSubmit: SubmitHandler<ConfirmFormFields> = (data) => {
    if (!data.agree) return;
    confirmAction();
    closeAction();
  };

  const errorMessage =
    errors.agree?.type === 'required' && '동의해야 수행할 수 있습니다.';

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-96 flex-col items-center py-8"
    >
      <div className="mb-2">{icon && icon}</div>
      <div className="flex flex-col items-center justify-center text-lg text-[#34355B]">
        {messages.map(
          (message) => message && <span key={message}>{message}</span>
        )}
        <span className="mt-1 text-base font-medium text-[#8D8DAD]">
          {targetName}
        </span>
      </div>
      {hasCheck && (
        <div className="relative mt-2 w-full">
          <Checkbox
            id="confirm-of-modal"
            type="checkbox"
            label="동의하기"
            register={register('agree', { required: true })}
            autoFocus
          />
          {errorMessage && <FormError error={errorMessage} top="14px" />}
        </div>
      )}
      <div className="mt-5 flex gap-4 text-base">
        <button
          type="button"
          className="css_default-button w-36 bg-[#E4E4E4] text-[#5E5A5A]"
          onClick={closeAction}
          ref={closeBtnRef}
        >
          창 닫기
        </button>
        <button
          type="submit"
          className="css_default-button w-36 bg-[#F0817A] text-white"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};