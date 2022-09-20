import { useState } from 'react';
import Button from '../../../components/molecules/Button';
import { RESERVATION_STATE_KOR } from '../../../constants/constants';
import {
  GetReservationsByPatientQuery,
  Patient,
  useGetReservationsByPatientLazyQuery,
} from '../../../graphql/generated/graphql';
import { getHHMM, getTimeLength, getYMD } from '../../../services/dateServices';
import ChevronDown from '../../../svgs/ChevronDown';
import ChevronUp from '../../../svgs/ChevronUp';
import { cls } from '../../../utils/utils';
import ListCell from '../atoms/ListCell';

type Reservations = NonNullable<
  GetReservationsByPatientQuery['getReservationsByPatient']['results']
>;

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
  const [reservationCount, setReservationCount] = useState(0);
  const [reservations, setReservations] = useState<Reservations>([]);

  const toggleAction = () => {
    setShowAction((prev) => !prev);
  };

  const [callQuery, { data }] = useGetReservationsByPatientLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  const onCompleted = (data: GetReservationsByPatientQuery) => {
    const { totalPages, totalCount, results } = data.getReservationsByPatient;

    const getNumbers = (pageNumber: number) => {
      const numbers = [1];
      while (numbers.length < pageNumber) {
        numbers.push(numbers.length + 1);
      }
      return numbers;
    };

    if (pageNumbers.length !== totalPages) {
      setPageNumbers(getNumbers(totalPages || 1));
    }
    if (reservationCount !== totalCount) {
      setReservationCount(totalCount || 0);
    }
    if (results) {
      setReservations(results);
    }
  };

  const queryReservations = (page: number) => {
    callQuery({
      variables: { input: { page, id } },
      onCompleted,
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
      <div
        className="grid grid-cols-[1fr,4rem,1fr,3rem,5rem,5rem] hover:cursor-pointer sm:px-6 lg:grid-cols-6"
        onClick={toggleAction}
      >
        <ListCell>{clinicName}</ListCell>
        <ListCell>{registrationNumber}</ListCell>
        <ListCell className="gap-1">
          {data ? showAction ? <ChevronUp /> : <ChevronDown /> : null}
          {name}
        </ListCell>
        <ListCell>{gender}</ListCell>
        <ListCell>{birthday}</ListCell>
        <ListCell>
          <Button
            canClick
            type="button"
            onClick={() => queryReservations(selectedPage)}
            loading={false}
            isSmall
          >
            지난 예약
          </Button>
        </ListCell>
      </div>

      {data && showAction && (
        <div className="flex flex-col items-center justify-center bg-gray-200 p-6 pb-2">
          <div className="w-full rounded-md bg-white">
            <div className="flex w-full px-4 pt-4">
              총 예약 수 : {reservationCount}
            </div>
            <div className="flex w-full border-b px-2">
              {['시간', '상태', '치료한사람', '예약한사람'].map((title) => (
                <ListCell key={title}>{title}</ListCell>
              ))}
            </div>
            <div className="sm:min-h-[320px]">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="flex w-full px-2">
                  <ListCell>
                    {getTime(reservation.startDate, reservation.endDate)}
                  </ListCell>
                  <ListCell>
                    {RESERVATION_STATE_KOR[reservation.state]}
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
