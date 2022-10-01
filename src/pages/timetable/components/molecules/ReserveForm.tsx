import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { TimetableModalProps } from '../../Timetable';
import Button from '../../../../components/molecules/Button';
import SelectUser from './SelectUser';
import {
  IListReservation,
  ISelectedPrescription,
  PrescriptionWithSelect,
  ReserveFormType,
} from '../../../../types/type';
import Textarea from '../../../../components/molecules/Textarea';
import { ROUTES } from '../../../../router/routes';
import { cls } from '../../../../utils/utils';
import Datepicker from '../../../../components/molecules/Datepicker/Datepicker';
import { useEffect, useState } from 'react';
import { useFindPrescriptionsQuery } from '../../../../graphql/generated/graphql';
import useStore from '../../../../hooks/useStore';
import { useForm } from 'react-hook-form';
import useReserve from '../../hooks/useReserve';

interface IReservaFromProps extends TimetableModalProps {
  userId: number;
  startDate?: Date;
  reservation?: IListReservation;
}

const isCreate = (reservation: IListReservation | undefined) => !!!reservation;

export default function ReserveForm({
  closeAction,
  startDate,
  userId,
  reservation,
}: IReservaFromProps) {
  const { selectedInfo, setSelectedInfo } = useStore();
  const {
    register,
    getValues,
    formState: { isValid, errors },
    handleSubmit,
    setValue,
  } = useForm<ReserveFormType>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (reservation) {
      setValue('memo', reservation.memo || '');
      setValue('userId', reservation.user.id);
      // @ts-ignore
      setSelectedInfo('patient', reservation.patient);
    } else if (userId) {
      setValue('userId', userId);
    }
  }, [userId, reservation]);

  // UI 상호작용
  const [selectedPrescription, setSelectedPrescription] =
    useState<ISelectedPrescription>({
      price: 0,
      minute: 0,
      prescriptions: [],
    });
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithSelect[]>(
    []
  );

  const { data: prescriptionsData } = useFindPrescriptionsQuery({
    variables: {
      input: {
        clinicId: selectedInfo.clinic?.id ?? 0,
        onlyLookUpActive: false,
      },
    },
  });

  function getTotal(
    getThis: 'price' | 'requiredTime',
    prescriptions: PrescriptionWithSelect[]
  ) {
    return prescriptions
      .filter((pre) => pre.isSelect)
      .reduce((prev, curr) => prev + curr[getThis], 0);
  }

  function onClickPrescription(
    id: number | null,
    prescriptions: PrescriptionWithSelect[],
    selectedPrescriptionData?: PrescriptionWithSelect[]
  ) {
    let newPrescriptions: PrescriptionWithSelect[] = [];

    if (selectedPrescriptionData) {
      newPrescriptions = prescriptions.map((prev) => {
        const exists = selectedPrescriptionData.find(
          (prescription) => prescription.id === prev.id
        );
        if (exists) {
          return { ...exists, isSelect: !prev.isSelect };
        }
        return { ...prev, isSelect: false };
      });
    } else {
      newPrescriptions = prescriptions.map((prev) => {
        if (prev.id === id) {
          return { ...prev, isSelect: !prev.isSelect };
        }
        return prev;
      });
    }

    const newState = {
      minute: getTotal('requiredTime', newPrescriptions),
      price: getTotal('price', newPrescriptions),
      prescriptions: newPrescriptions
        .filter((prescription) => prescription.isSelect)
        .map((prescription) => prescription.id),
    };

    setPrescriptions(newPrescriptions);
    setSelectedPrescription(newState);
  }

  useEffect(() => {
    if (prescriptionsData) {
      let prescriptions =
        prescriptionsData.findPrescriptions.prescriptions
          ?.filter((prescription) => prescription.activate)
          .map((prescription) => ({
            ...prescription,
            isSelect: false,
          })) ?? [];
      setPrescriptions(prescriptions);
    }
  }, [prescriptionsData]);

  // 데이터 통신
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    startDate || new Date()
  );

  const { createReservation, editReservation, loading } = useReserve({
    isCreate: isCreate(reservation),
    closeAction,
  });

  const onSubmit = () => {
    if (loading) return;
    if (!selectedStartDate) throw new Error('시작날짜가 없습니다.');
    const endDate = new Date(selectedStartDate);
    // startDate와 같은 값인 endDate에 치료시간을 분으로 더함
    endDate.setMinutes(endDate.getMinutes() + selectedPrescription.minute);

    const { memo, userId } = getValues();

    if (isCreate(reservation)) {
      createReservation({
        startDate: selectedStartDate,
        endDate,
        memo,
        userId: +userId!,
        clinicId: selectedInfo.clinic!.id,
        patientId: selectedInfo.patient!.id,
        prescriptionIds: selectedPrescription.prescriptions,
      });
      return;
    }

    editReservation({
      startDate: selectedStartDate,
      endDate,
      memo,
      userId: +userId!,
      reservationId: reservation!.id,
      prescriptionIds: selectedPrescription.prescriptions,
    });
  };

  //
  useEffect(() => {
    return () => {
      setSelectedInfo('patient', null);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-4">
      <label className="flex flex-col gap-2">
        담당 치료사
        <SelectUser
          members={selectedInfo.clinic?.members ?? []}
          register={register('userId')}
        />
      </label>
      <label className="flex flex-col gap-2">
        시작 시각
        <Datepicker
          setSelectedDate={setSelectedStartDate}
          hasHour
          defaultDate={new Date(startDate ?? reservation?.startDate)}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="flex items-center gap-1">
          처방
          <Link to={ROUTES.prescription}>
            <FontAwesomeIcon icon={faLink} fontSize={14} className="btn-menu" />
          </Link>
        </span>
        {prescriptions.length === 0 ? (
          <div className="flex flex-col items-center px-2 ">
            <span>등록된 처방이 없습니다.</span>
            <span>
              처방을
              <Link to={ROUTES.prescription}>
                <button
                  type="button"
                  className="btn-sm btn-border mx-2 w-fit shadow-cst"
                >
                  <FontAwesomeIcon icon={faLink} />
                  등록
                </button>
                하세요
              </Link>
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <ul className="grid grid-cols-4 gap-x-3 gap-y-1">
              {prescriptions.map((prescription, index) => (
                <li
                  key={index}
                  value={prescription.id}
                  onClick={() =>
                    onClickPrescription(prescription.id, prescriptions)
                  }
                  className={cls(
                    'btn-menu overflow-hidden rounded-md border text-center',
                    prescription.isSelect
                      ? 'border-green-500 font-semibold'
                      : 'opacity-50'
                  )}
                >
                  {prescription.name}
                </li>
              ))}
            </ul>
            <div className="flex justify-around">
              <span>총가격 : {selectedPrescription.price}원</span>
              <span>치료시간 : {selectedPrescription.minute}분</span>
            </div>
          </div>
        )}
      </label>
      <Textarea
        id="reserve-form__memo"
        label={'메모'}
        placeholder={'처방에 대한 설명'}
        register={register('memo', {
          maxLength: { value: 200, message: '최대 200자입니다' },
        })}
        rows={2}
      />
      <Button
        type="submit"
        canClick={
          selectedInfo.patient &&
          isValid &&
          selectedPrescription.prescriptions.length >= 1
        }
        loading={loading}
      >
        {reservation ? '예약수정' : '예약하기'}
      </Button>
    </form>
  );
}
