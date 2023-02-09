import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Pencil, TrashPot } from '../../../../svgs';
import { cls } from '../../../../utils/common.utils';
import { useTogglePrescriptionActivate } from '../../../../hooks';
import { ConfirmModal } from '../../../../components';
import type {
  CardProps,
  TogglePrescriptionActivateProps,
} from '../../../../types/props.types';

const PrescriptionItem = ({ prescription, showInactivate }: CardProps) => {
  const {
    id,
    name,
    price,
    requiredTime,
    activate,
    description,
    prescriptionAtoms,
  } = prescription;

  const status = activate ? '활성' : '비활성';

  if (!showInactivate && !prescription.activate) return null;

  return (
    <div className="prescription-management-item border bg-white text-[#262850]">
      <div className="prescription-management-item__col1">{name}</div>
      <div className="prescription-management-item__col2">{requiredTime}분</div>
      <div className="prescription-management-item__col3">{price}원</div>
      <ul className="prescription-management-item__col4 flex flex-col">
        {prescriptionAtoms?.map((atom) => (
          <li key={atom.id}>{atom.name}</li>
        ))}
      </ul>
      <p className="prescription-management-item__col5 flex min-h-[5rem] flex-col justify-center whitespace-normal py-1">
        {description || '-'}
      </p>
      <div
        className={cls(
          'prescription-management-item__col6',
          activate ? 'text-[#68BB89]' : 'text-[#AB0000]'
        )}
      >
        {status}
      </div>
      <div className="prescription-management-item__col7 flex gap-7">
        <EditPrescription id={id} />
        <TogglePrescriptionActivate id={id} name={name} activate={!!activate} />
      </div>
    </div>
  );
};

const EditPrescription = ({ id }: { id: number }) => {
  return (
    <Link to={`${id}/edit`}>
      <Pencil />
    </Link>
  );
};

const TogglePrescriptionActivate = ({
  id,
  name,
  activate,
}: TogglePrescriptionActivateProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const openConfirm = () => {
    setShowConfirm(true);
  };
  const closeConfirm = () => {
    setShowConfirm(false);
  };

  const { toggleActivation } = useTogglePrescriptionActivate();
  const invokeToggleActivation = () => {
    toggleActivation(id, activate);
  };

  const todo = activate ? '비활성' : '활성';
  const messages = [
    `처방을 ${todo} 합니다.`,
    activate ? `${todo}되면 정보 수정이 불가능합니다.` : '',
  ];
  const buttonText = `${todo}하기`;

  return (
    <>
      <button onClick={openConfirm} type="button">
        <TrashPot className="" />
      </button>
      {showConfirm && (
        <ConfirmModal
          closeAction={closeConfirm}
          confirmAction={invokeToggleActivation}
          messages={messages}
          targetName={name}
          buttonText={buttonText}
        />
      )}
    </>
  );
};

export default PrescriptionItem;
