import { Pencil, TrashPot } from '../../../../svgs';
import { cls } from '../../../../utils/common.utils';
import type { CardProps } from '../../../../types/props.types';

const PrescriptionItem = ({ prescription }: CardProps) => {
  const {
    name,
    price,
    requiredTime,
    activate,
    description,
    prescriptionAtoms,
  } = prescription;

  const status = activate ? '활성' : '비활성';

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
        <Pencil />
        <TrashPot className="" />
      </div>
    </div>
  );
};

export default PrescriptionItem;
