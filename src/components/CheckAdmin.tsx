import { PropsWithChildren, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import NotFound from './NotFound';
import { CHECK_ADMIN_DOCUMENT } from '../graphql';
import type { CheckAdminQuery } from '../types/generated.types';

const CheckAdmin = ({ children }: PropsWithChildren) => {
  const [callCheckAdmin, { data }] =
    useLazyQuery<CheckAdminQuery>(CHECK_ADMIN_DOCUMENT);

  const [hasInput, setHasInput] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = formData.get('code');
    if (code && typeof code === 'string') {
      callCheckAdmin({ variables: { code } });
    }
  };

  const handleKeyDown = (event: globalThis.KeyboardEvent) => {
    const { altKey, shiftKey, code } = event;
    if (altKey && shiftKey && code === 'ShiftRight') {
      setHasInput((prev) => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {data?.checkAdmin.ok ? (
        children
      ) : (
        <>
          <NotFound />
          {hasInput && (
            <form onSubmit={handleSubmit}>
              <input
                id="hello"
                className="fixed left-0 bottom-0 w-2 appearance-none text-white outline-none"
                name="code"
                type="text"
              />
            </form>
          )}
        </>
      )}
    </>
  );
};
export default CheckAdmin;
