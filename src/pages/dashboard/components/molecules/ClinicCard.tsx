import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHTMLAttributes } from 'react';
import CardContainer from '../../../../components/templates/CardContainer';
import { ChildrenProps } from '../../../../types/type';
import { cls, getMemberState } from '../../../../utils/utils';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ChildrenProps {
  loading?: boolean;
}

function Button({ loading, children, ...args }: ButtonProps) {
  return (
    <div className="flex h-full w-full items-center border-t">
      <button
        {...args}
        className={cls(
          'flex w-full items-center justify-center hover:cursor-pointer hover:font-semibold',
          loading ? 'pointer-events-none' : ''
        )}
      >
        {loading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            fontSize={16}
            className="absolute mx-auto animate-spin"
          />
        ) : (
          children
        )}
      </button>
    </div>
  );
}

function ButtonContainer({ children }: ChildrenProps) {
  return <div className="BUTTONS flex h-1/3 divide-x"> {children}</div>;
}

interface CardProps {
  clinicName: string;
  children: React.ReactNode;
  isActivate: boolean;
  state?: ReturnType<typeof getMemberState>;
}

function ClinicCard({ clinicName, state, isActivate, children }: CardProps) {
  return (
    <div
      className={cls(
        'flex h-20 w-80 flex-col justify-between rounded-md border',
        state === '관리자' ? '-order-1' : ''
      )}
    >
      <div className="relative flex h-2/3 flex-col justify-center px-6">
        <p className="">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-medium">
            {clinicName}
          </span>
          <span
            className={cls(
              'ml-2',
              state === '탈퇴'
                ? 'rounded-md bg-gray-100 px-1.5 py-0.5 text-gray-700'
                : state === '승인대기'
                ? 'rounded-md bg-red-100 px-1.5 py-0.5 text-red-700'
                : 'rounded-md bg-green-100 px-1.5 py-0.5 text-green-700'
            )}
          >
            {state}
          </span>
        </p>
        <p>{isActivate || <span> / 폐쇄</span>}</p>
      </div>
      {children}
    </div>
  );
}

ClinicCard.Button = Button;
ClinicCard.ButtonContainer = ButtonContainer;
ClinicCard.Container = CardContainer;

export default ClinicCard;
