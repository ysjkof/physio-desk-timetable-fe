import { useReactiveVar } from '@apollo/client';
import { ReactNode } from 'react';
import { cls } from '../../../utils/utils';
import { viewOptionsVar } from '../../../store';
import { ONE_DAY } from '../../../constants/constants';

interface TableLoopTemplateProps {
  userLength: number;
  children: ReactNode;
  isUserCols?: boolean;
  isActiveBorderTop?: boolean;
  elementName?: string;
}
export function TableLoopTemplate({
  userLength,
  children,

  elementName,
}: TableLoopTemplateProps) {
  const viewOptions = useReactiveVar(viewOptionsVar);

  return (
    <div
      className={cls(elementName ? elementName : '', 'grid w-full')}
      style={
        viewOptions.periodToView === ONE_DAY
          ? {
              gridTemplateColumns: `repeat(1, minmax(${
                userLength * 6
              }rem,1fr))`,
            }
          : {
              gridTemplateColumns: `repeat(7, minmax(${userLength * 6}rem,1fr)`,
            }
      }
    >
      {children}
    </div>
  );
}
