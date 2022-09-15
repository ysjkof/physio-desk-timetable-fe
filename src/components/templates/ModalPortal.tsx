import { createPortal } from 'react-dom';
import { cls } from '../../utils/utils';

interface IModalPortal {
  closeAction: () => void;
  children?: React.ReactNode;
  left?: number;
  right?: number;
  top?: number;
}

export default function ModalPortal({
  closeAction,
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
          'modal-background',
          top ? 'bg-transparent opacity-100' : ''
        )}
        onClick={closeAction}
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
