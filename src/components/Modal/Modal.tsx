import { type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { cls } from '../../utils/commonUtils';
import type { CloseAction } from '../../types/propsTypes';

interface ModalProps extends CloseAction, PropsWithChildren {
  left?: number;
  right?: number;
  top?: number;
}

export const Modal = (props: ModalProps) => {
  const container = document.getElementById('root') as HTMLElement;
  return createPortal(<ModalChildrenContainer {...props} />, container);
};

const ModalChildrenContainer = (props: ModalProps) => {
  const { closeAction, children, left, right, top } = props;

  return (
    <div className="modal-parents flex items-center justify-center">
      <div
        className={cls(
          'modal-background',
          top ? 'bg-transparent opacity-100' : ''
        )}
        onClick={closeAction}
        onKeyDown={closeAction}
        role="button"
        tabIndex={-1}
      />
      <div
        className={
          top
            ? 'absolute'
            : 'relative mx-auto w-fit space-y-4 rounded-md bg-white'
        }
        style={{
          ...(top && { top }),
          ...(left && { left }),
          ...(right && { right }),
        }}
      >
        {children}
      </div>
    </div>
  );
};
