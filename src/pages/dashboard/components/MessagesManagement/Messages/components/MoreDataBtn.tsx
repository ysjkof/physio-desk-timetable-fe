import { PropsWithChildren } from 'react';

interface MoreDataBtnProps extends PropsWithChildren {
  fetchMore: () => void;
}

export const MoreDataBtn = ({ fetchMore, children }: MoreDataBtnProps) => {
  return (
    <button
      className="my-4 rounded-3xl border  border-transparent bg-white px-4 py-2 text-sm font-medium shadow hover:border-gray-600"
      onClick={fetchMore}
    >
      {children}
    </button>
  );
};
