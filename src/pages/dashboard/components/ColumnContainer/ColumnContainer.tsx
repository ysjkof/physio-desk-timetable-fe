import { type PropsWithChildren } from 'react';

const ColumnContainer = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-full w-[200px] flex-col gap-y-10 border-r border-r-table-line px-4 pt-8">
      {children}
    </div>
  );
};

export default ColumnContainer;
