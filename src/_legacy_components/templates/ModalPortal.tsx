import { createPortal } from 'react-dom';
import { cls } from '../../utils/common.utils';
import type { CloseAction } from '../../types/props.types';

interface IModalPortal extends CloseAction {
  children?: React.ReactNode;
  left?: number;
  right?: number;
  top?: number;
}

export default function ModalPortal({
  closeAction: closeModal,
  children,
  left,
  right,
  top,
}: IModalPortal) {
  const container = document.getElementById('root') as HTMLElement;

  return createPortal(
    <div className="modal-parents">
      <div
        className={cls(
          'modal-background foo',
          top ? 'bg-transparent opacity-100' : ''
        )}
        onClick={closeModal}
        onKeyDown={closeModal}
        role="button"
        tabIndex={-1}
      />
      <div
        className={top ? 'absolute' : 'modal-content'}
        style={{
          ...(top && { top }),
          ...(left && { left }),
          ...(right && { right }),
        }}
      >
        {children}
      </div>
    </div>,
    container
  );
}
