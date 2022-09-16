import { useEffect, useState } from 'react';
import { useCheckAdminLazyQuery } from '../graphql/generated/graphql';
import NotFound from '../components/404';

interface CheckAdminProps {
  children: React.ReactNode;
}
export default function CheckAdmin({ children }: CheckAdminProps) {
  const [checkAdminMutation, { data }] = useCheckAdminLazyQuery();
  const [hasInput, setHasInput] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = formData.get('code');
    if (code && typeof code === 'string') {
      checkAdminMutation({ variables: { code } });
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
}
