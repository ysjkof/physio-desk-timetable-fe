import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet-async';
import { ClinicsOfClient } from '../../models';
import { renameUseSplit } from '../../utils/utils';

interface ModalContentLayoutProps {
  title: string;
  children: React.ReactNode;
  closeAction: () => void;
}
// create-patient, reservation-card, reserve-card에 공통 레이아웃
export default function ModalContentsLayout({
  title,
  children,
  closeAction,
}: ModalContentLayoutProps) {
  const { selectedClinic } = ClinicsOfClient;

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
        {selectedClinic.name && (
          <span className="ml-3 text-xs">
            {renameUseSplit(selectedClinic.name)}
          </span>
        )}
      </div>
      {children}
    </>
  );
}
