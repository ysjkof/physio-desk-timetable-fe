import { Link } from 'react-router-dom';
import { Pencil, TrashPot } from '../../../../svgs';
import { cls } from '../../../../utils/commonUtils';
import { useTogglePrescriptionActivation } from '../../../../hooks';
import { setConfirm } from '../../../../store';
import type {
  CardProps,
  TogglePrescriptionActivationProps,
} from '../../../../types/propsTypes';

const PrescriptionItem = ({
  prescription,
  seeInactivation: showInactivate,
}: CardProps) => {
  const {
    id,
    name,
    price,
    requiredTime,
    isActive,
    description,
    prescriptionAtoms,
  } = prescription;

  const status = isActive ? '활성' : '비활성';

  if (!showInactivate && !isActive) return null;

  return (
    <div className="prescription-management__table-row border bg-white text-[#262850]">
      <div className="prescription-management__table-row-col1">{name}</div>
      <div className="prescription-management__table-row-col2">
        {requiredTime}분
      </div>
      <div className="prescription-management__table-row-col3">{price}원</div>
      <ul className="prescription-management__table-row-col4 flex flex-col">
        {prescriptionAtoms?.map((atom) => (
          <li key={atom.id}>{atom.name}</li>
        ))}
      </ul>
      <p className="prescription-management__table-row-col5 flex min-h-[5rem] flex-col justify-center whitespace-normal py-1">
        {description || '-'}
      </p>
      <div
        className={cls(
          'prescription-management__table-row-col6',
          isActive ? 'text-[#68BB89]' : 'text-[#AB0000]'
        )}
      >
        {status}
      </div>
      <div className="prescription-management__table-row-col7 flex gap-7">
        <EditPrescription id={id} />
        <TogglePrescriptionActivation
          id={id}
          name={name}
          isActive={!!isActive}
        />
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

const TogglePrescriptionActivation = ({
  id,
  name,
  isActive,
}: TogglePrescriptionActivationProps) => {
  const { toggleActivation } = useTogglePrescriptionActivation();
  const invokeToggleActivation = () => {
    toggleActivation(id, isActive);
  };

  const todo = isActive ? '비활성' : '활성';
  const messages = [
    `처방을 ${todo} 합니다.`,
    isActive ? `${todo}되면 정보 수정이 불가능합니다.` : '',
  ];
  const buttonText = `${todo}하기`;

  const openConfirm = () => {
    setConfirm({
      confirmAction: invokeToggleActivation,
      messages,
      targetName: name,
      buttonText,
      hasCheck: true,
      isPositive: !isActive,
    });
  };

  return (
    <button onClick={openConfirm} type="button">
      <TrashPot className="" />
    </button>
  );
};

export default PrescriptionItem;
