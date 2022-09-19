import { useState } from 'react';
import Button from '../../../components/molecules/Button';
import { Patient } from '../../../graphql/generated/graphql';
import ChevronDown from '../../../svgs/ChevronDown';
import ChevronUp from '../../../svgs/ChevronUp';
import ListCell from '../atoms/ListCell';

interface SearchListProps
  extends Pick<Patient, 'registrationNumber' | 'name' | 'gender' | 'birthday'> {
  clinicName: string;
}

export default function SearchList({
  clinicName,
  registrationNumber,
  name,
  gender,
  birthday,
}: SearchListProps) {
  const [showAction, setShowAction] = useState(false);
  const toggleAction = () => {
    setShowAction((prev) => !prev);
  };

  return (
    <div className="hover:shadow-cst">
      <div className="flex px-6 hover:cursor-pointer" onClick={toggleAction}>
        <ListCell>{clinicName}</ListCell>
        <ListCell>{registrationNumber}</ListCell>
        <ListCell className="gap-1">
          {showAction ? <ChevronUp /> : <ChevronDown />}
          {name}
        </ListCell>
        <ListCell>{gender}</ListCell>
        <ListCell>{birthday || ''}</ListCell>
      </div>
      {showAction && (
        <div className="flex items-center justify-center gap-10 px-6 pb-2">
          <Button
            canClick
            type="button"
            onClick={() => ''}
            loading={false}
            isSmall
          >
            환자 정보 수정
          </Button>
          <Button
            canClick
            type="button"
            onClick={() => ''}
            loading={false}
            isSmall
          >
            환자 예약 조회
          </Button>
        </div>
      )}
    </div>
  );
}
