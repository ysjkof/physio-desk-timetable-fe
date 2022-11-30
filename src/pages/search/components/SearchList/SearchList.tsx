import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import ChevronDown from '../../../../svgs/ChevronDown';
import ChevronUp from '../../../../svgs/ChevronUp';
import { ListCell } from '../../../../components';
import { PreviousReservation } from './PreviousReservation';
import { GET_RESERVATIONS_BY_PATIENT_DOCUMENT } from '../../../../graphql';
import type {
  GetReservationsByPatientQuery,
  Patient,
} from '../../../../types/generated.types';

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
  const [callQuery, { data }] = useLazyQuery<GetReservationsByPatientQuery>(
    GET_RESERVATIONS_BY_PATIENT_DOCUMENT,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const [canSeeMore, setCanSeeMore] = useState(false);
  const [page, setPage] = useState(1);

  const toggleCanSee = () => {
    setCanSeeMore((prev) => !prev);
  };

  const changePage = (pageNumber: number) => {
    if (page === pageNumber) return;
    setPage(pageNumber);
  };

  useEffect(() => {
    if (!canSeeMore) return;
    callQuery({
      variables: { input: { page, id } },
    });
  }, [canSeeMore, page]);

  return (
    <div className="hover:shadow-cst">
      <div
        className="grid grid-cols-[1fr,4rem,1fr,3rem,5rem,5rem] hover:cursor-pointer sm:px-6 lg:grid-cols-6"
        onClick={toggleCanSee}
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
      {canSeeMore && (
        <PreviousReservation changePage={changePage} data={data} />
      )}
    </div>
  );
}
