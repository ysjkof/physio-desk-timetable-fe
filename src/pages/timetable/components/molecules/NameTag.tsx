import { faFemale, faMale } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useStore from '../../../../hooks/useStore';
import { getYMD } from '../../../../services/dateServices';
import { SelectedPatient } from '../../../../types/type';
import { cls } from '../../../../utils/utils';

export interface INameTagProps extends SelectedPatient {
  canClick?: boolean;
}

export const NameTag = ({
  id,
  gender,
  name,
  registrationNumber,
  birthday,
  clinicName,
  canClick = false,
  user,
}: INameTagProps) => {
  const { setSelectedInfo } = useStore();
  const onClick = () =>
    setSelectedInfo('patient', {
      id,
      gender,
      name,
      registrationNumber,
      birthday,
      clinicName,
      user,
    });

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
          {name!.length > 8 ? `${name!.substring(0, 8)}...` : name}
        </span>
      </div>
      <span>R.No : {registrationNumber ? registrationNumber : '미등록'}</span>
      <span>B : {birthday ? getYMD(birthday, 'yymmdd') : '미등록'}</span>
      <span className="pl-3">{user?.name}</span>
      {clinicName && <span className="col-span-2">{clinicName}</span>}
    </div>
  );
};
