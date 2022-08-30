import { useReactiveVar } from '@apollo/client';
import { useEffect } from 'react';
import { toastVar } from '../../store';
import { cls } from '../../utils/utils';

export default function Toast() {
  const { message, fade } = useReactiveVar(toastVar);

  const closeToast = () => {
    toastVar({ message: undefined, fade: false });
  };

  useEffect(() => {
    if (!message || !fade) return;
    setTimeout(closeToast, 3000);
  }, [message, fade]);

  return (
    <>
      {message && (
        <div
          className={cls(
            'position-center fixed z-50 flex flex-col gap-4 rounded-md bg-slate-600 px-6 py-4 text-xl font-semibold text-white',
            fade ? 'animate-fadeout' : ''
          )}
        >
          {message}
          <button
            onClick={closeToast}
            autoFocus
            className="rounded-md border-2 border-white px-1 font-normal outline-none focus:ring focus:ring-blue-400"
          >
            닫기
          </button>
        </div>
      )}
    </>
  );
}
