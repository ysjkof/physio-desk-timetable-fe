import { useState } from 'react';
import Button from '../../../components/molecules/Button';
import {
  Patient,
  useGetReservationsByPatientLazyQuery,
} from '../../../graphql/generated/graphql';
import { getHHMM, getTimeLength, getYMD } from '../../../services/dateServices';
import ChevronDown from '../../../svgs/ChevronDown';
import ChevronUp from '../../../svgs/ChevronUp';
import { cls } from '../../../utils/utils';
import ListCell from '../atoms/ListCell';

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
  const [showAction, setShowAction] = useState(false);

  const [selectedPage, setSelectedPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([1]);
  const toggleAction = () => {
    setShowAction((prev) => !prev);
  };

  const [callQuery, { data, loading }] = useGetReservationsByPatientLazyQuery({
    onCompleted(data) {
      const { totalPages } = data.getReservationsByPatient;
      if (totalPages) {
        const numbers = [1];
        while (numbers.length < totalPages) {
          numbers.push(numbers.length + 1);
        }
        setPageNumbers(numbers);
      }
    },
  });

  const queryReservations = (page: number) => {
    callQuery({
      variables: { input: { page, id } },
    });
  };

  const changePage = (pageNumber: number) => {
    if (selectedPage === pageNumber) return;
    setSelectedPage(pageNumber);
    queryReservations(pageNumber);
  };

  const getTime = (start: Date | string, end: Date | string) => {
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);

    return `${getYMD(startDate, 'yyyymmdd', '-')} ${getHHMM(
      startDate,
      ':'
    )}(${getTimeLength(startDate, endDate, 'minute')}분 치료)`;
  };

  return (
    <div className="hover:shadow-cst">
      <div className="flex px-6 hover:cursor-pointer" onClick={toggleAction}>
        <ListCell>{clinicName}</ListCell>
        <ListCell>{registrationNumber}</ListCell>
        <ListCell className="gap-1">
          {data ? showAction ? <ChevronUp /> : <ChevronDown /> : null}
          {name}
        </ListCell>
        <ListCell>{gender}</ListCell>
        <ListCell>{birthday}</ListCell>
        <ListCell className="gap-2">
          <Button
            canClick
            type="button"
            onClick={() => queryReservations(selectedPage)}
            loading={loading}
            isSmall
          >
            지난 예약
          </Button>
        </ListCell>
      </div>

      {showAction && data && (
        <div className="flex flex-col items-center justify-center bg-gray-200 p-6 pb-2">
          <div className="w-full rounded-md bg-white">
            <div className="flex w-full px-4 pt-4">
              총 예약 수 : {data?.getReservationsByPatient.totalCount}
            </div>
            <div className="flex w-full border-b px-2">
              <ListCell>시간</ListCell>
              <ListCell>상태</ListCell>
              <ListCell>치료한사람</ListCell>
              <ListCell>수정한사람</ListCell>
            </div>
            <div className="h-[320px]">
              {data?.getReservationsByPatient.results?.map((reservation) => (
                <div key={reservation.id} className="flex w-full px-2">
                  <ListCell>
                    {getTime(reservation.startDate, reservation.endDate)}
                  </ListCell>
                  <ListCell>
                    {reservation.state}
                    {reservation.isFirst && '신환'}
                  </ListCell>
                  <ListCell>{reservation.user.name}</ListCell>
                  <ListCell>{reservation.lastModifier.name}</ListCell>
                </div>
              ))}
            </div>
            <div className="flex w-full items-center justify-center border-t">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={cls(
                    'px-2 py-1',
                    selectedPage === pageNumber ? 'font-semibold' : ''
                  )}
                  onClick={() => changePage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
