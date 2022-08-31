import { useReactiveVar } from '@apollo/client';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { selectedInfoVar } from '../../store';
import { renameUseSplit } from '../../utils/utils';

interface ModalContentLayoutProps {
  title: string;
  children: ReactNode;
  closeAction: () => void;
}
// create-patient, reservation-card, reserve-card에 공통 레이아웃
export const ModalContentsLayout = ({
  title,
  children,
  closeAction,
}: ModalContentLayoutProps) => {
  const selectedInfo = useReactiveVar(selectedInfoVar);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <button className="absolute right-6 top-5" onClick={() => closeAction()}>
        <FontAwesomeIcon icon={faXmark} fontSize={14} />
      </button>
      <div className="w-full text-base font-semibold">
        {title}
        {selectedInfo.clinic?.name && (
          <span className="ml-3 text-xs">
            {renameUseSplit(selectedInfo.clinic.name)}
          </span>
        )}
      </div>
      {children}
    </>
  );
};
