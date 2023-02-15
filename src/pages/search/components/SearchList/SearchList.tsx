import { useState } from 'react';
import { ChevronDown, ChevronUp } from '../../../../svgs';
import { ListCell } from '../../../../components';
import { PreviousReservation } from './PreviousReservation';
import type { Patient } from '../../../../types/generatedTypes';

interface SearchListProps
  extends Pick<
    Patient,
    'id' | 'registrationNumber' | 'name' | 'gender' | 'birthday'
  > {
  clinicName: string;
}

export default function SearchList({
  id,
  clinicName,
  registrationNumber,
  name,
  gender,
  birthday,
}: SearchListProps) {
  const [canSeeMore, setCanSeeMore] = useState(false);

  const toggleCanSee = () => {
    setCanSeeMore((prev) => !prev);
  };

  return (
    <div className="hover:shadow-cst">
      <div
        className="grid grid-cols-[1fr,4rem,1fr,3rem,5rem,5rem] hover:cursor-pointer sm:px-6 lg:grid-cols-6"
        onClick={toggleCanSee}
        onKeyDown={toggleCanSee}
        tabIndex={0}
        role="button"
      >
        <ListCell>{clinicName}</ListCell>
        <ListCell>{registrationNumber}</ListCell>
        <ListCell className="gap-1">
          {canSeeMore ? <ChevronUp /> : <ChevronDown />}
          {name}
        </ListCell>
        <ListCell>{gender}</ListCell>
        <ListCell>{birthday}</ListCell>
        <ListCell>-</ListCell>
      </div>
      {canSeeMore && <PreviousReservation userId={id} />}
    </div>
  );
}
