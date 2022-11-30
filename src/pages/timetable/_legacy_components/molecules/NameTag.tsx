import { faFemale, faMale } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getYMD } from '../../../../services/dateServices';
import { selectedPatientVar } from '../../../../store';
import { cls, renameUseSplit } from '../../../../utils/utils';
import type { SelectedPatient } from '../../../../types/common.types';

export interface INameTagProps {
  patient: SelectedPatient;
  canClick?: boolean;
}

export default function NameTag({ patient, canClick = false }: INameTagProps) {
  const { gender, name, registrationNumber, birthday, clinic, user } = patient;

  const onClick = () => selectedPatientVar(patient);

  return (
    <div
      onClick={canClick ? onClick : undefined}
      className={cls(
        'grid w-full cursor-pointer grid-cols-3',
        canClick ? '' : 'pointer-events-none'
      )}
    >
      <div>
        {gender === 'male' ? (
          <FontAwesomeIcon icon={faMale} className="text-blue-500" />
        ) : (
          <FontAwesomeIcon icon={faFemale} className="text-pink-500" />
        )}
        <span className="ml-1 min-w-[56px] overflow-hidden whitespace-nowrap">
          {name.length > 8 ? `${name.substring(0, 8)}...` : name}
        </span>
      </div>
      <span>R.No : {registrationNumber ? registrationNumber : '미등록'}</span>
      <span>B : {birthday ? getYMD(birthday, 'yymmdd') : '미등록'}</span>
      <span className="pl-3">{user.name}</span>
      <span className="col-span-2">{renameUseSplit(clinic.name)}</span>
    </div>
  );
}
