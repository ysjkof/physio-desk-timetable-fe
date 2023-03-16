import { type ReactNode } from 'react';
import { cls } from '../../../../../utils/commonUtils';

interface PaddingWrapperProps {
  children: ReactNode;
  hasBorder?: boolean;
}

const PaddingWrapper = ({ children, hasBorder }: PaddingWrapperProps) => {
  return (
    <div className={cls('px-2', hasBorder ? 'border-r' : '')}>{children}</div>
  );
};
export default PaddingWrapper;
