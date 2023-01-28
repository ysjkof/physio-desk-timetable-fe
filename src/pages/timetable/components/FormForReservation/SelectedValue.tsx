import { PropsWithChildren } from 'react';

interface SelectedValueProps extends PropsWithChildren {
  clearValue: () => void;
}

export const SelectedValue = ({ clearValue, children }: SelectedValueProps) => {
  return (
    <div
      className="flex justify-between rounded-md border bg-disable py-2 px-3"
      onClick={clearValue}
      onKeyDown={clearValue}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
};
