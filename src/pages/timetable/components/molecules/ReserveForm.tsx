import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { TimetableModalProps } from '../..';
import {
  CreateReservationMutation,
  EditReservationMutation,
  ReservationState,
  useCreateReservationMutation,
  useEditReservationMutation,
  useFindPrescriptionsQuery,
} from '../../../../graphql/generated/graphql';
import DatepickerWithInput from '../../../../components/molecules/DatepickerWithInput';
import Button from '../../../../components/molecules/Button';
import FormError from '../../../../components/atoms/FormError';
import SelectUser from './SelectUser';
import DayOffForm from './DayOffForm';
import {
  IListReservation,
  IReserveForm,
  ISelectedPrescription,
  PrescriptionWithSelect,
} from '../../../../types/type';
import useStore from '../../../../hooks/useStore';
import Textarea from '../../../../components/molecules/Textarea';
import { toastVar } from '../../../../store';
import { ROUTES } from '../../../../router/routes';
import { cls } from '../../../../utils/utils';

interface IReservaFromProps extends TimetableModalProps {
  startDate?: Date;
  userId: number;
  selectedPrescriptionData?: PrescriptionWithSelect[];
  reservation?: IListReservation;
  isDayoff?: boolean;
}

export default function ReserveForm({
  closeAction,
  startDate,
  userId,
  selectedPrescriptionData,
  reservation,
  isDayoff,
}: IReservaFromProps) {
  const { selectedInfo, setSelectedInfo } = useStore();
  const [selectedPrescription, setSelectedPrescription] =
    useState<ISelectedPrescription>({
      price: 0,
      minute: 0,
      prescriptions: [],
    });
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithSelect[]>(
    []
  );
  const [selectedStartDateState, setSelectedStartDateState] =
    useState<Date | null>(startDate || new Date());
  const [selectedEndDateState, setSelectedEndDateState] = useState<Date | null>(
    null
  );

  const isDayOff = isDayoff ?? reservation?.state === ReservationState.DayOff;

  const { data: prescriptionsData } = useFindPrescriptionsQuery({
    variables: {
      input: {
        clinicId: selectedInfo.clinic?.id ?? 0,
        onlyLookUpActive: false,
      },
    },
  });

  const {
    register,
    getValues,
    formState: { isValid },
    handleSubmit,
    setValue,
  } = useForm<IReserveForm>({
    mode: 'onChange',
  });

  const createOnCompleted = (data: CreateReservationMutation) => {
    const {
      createReservation: { ok, error },
    } = data;
    if (error) {
      toastVar({ messages: [`오류가 발생했습니다; ${error}`] });
    }
    if (ok) closeAction();
  };
  const editOnComplete = (data: EditReservationMutation) => {
    const {
      editReservation: { ok, error },
    } = data;
    if (error) {
      toastVar({ messages: [`오류가 발생했습니다; ${error}`] });
    }
    // 할일: 캐시작업
    if (ok) closeAction();
  };

  const [
    createReservationMutation,
    { loading: createLoading, data: createReservationResult },
  ] = useCreateReservationMutation({ onCompleted: createOnCompleted });

  const [
    callEditReservation,
    { loading: editLoading, data: editReservationResult },
  ] = useEditReservationMutation({ onCompleted: editOnComplete });

  const onSubmit = () => {
    if (createLoading) return;

    let startDate = new Date(selectedStartDateState || '');
    if (!startDate) throw new Error('startDate가 없습니다');

    const { memo, userId } = getValues();

    if (isDayOff) {
      if (!selectedEndDateState) throw new Error('endDate가 없습니다.');
      let endDate = new Date(selectedEndDateState);

      if (reservation) {
        if (!editLoading)
          callEditReservation({
            variables: {
              input: {
                startDate,
                endDate,
                memo,
                userId: +userId!,
                reservationId: reservation.id,
              },
            },
          });
      } else {
        if (!createLoading)
          createReservationMutation({
            variables: {
              input: {
                startDate,
                endDate,
                memo,
                isDayoff: true,
                userId: +userId!,
                clinicId: selectedInfo.clinic!.id,
              },
            },
          });
      }
      return;
    }
    const endDate = new Date(startDate);

    // startDate와 같은 값인 endDate에 치료시간을 분으로 더함
    endDate.setMinutes(endDate.getMinutes() + selectedPrescription.minute);
    if (reservation) {
      // reservation이 있으면 edit모드

      if (!editLoading)
        callEditReservation({
          variables: {
            input: {
              startDate,
              endDate,
              memo,
              userId: +userId!,
              reservationId: reservation.id,
              prescriptionIds: selectedPrescription.prescriptions,
            },
          },
        });
    } else {
      if (!createLoading)
        createReservationMutation({
          variables: {
            input: {
              startDate,
              endDate,
              memo,
              userId: +userId!,
              clinicId: selectedInfo.clinic!.id,
              patientId: selectedInfo.patient!.id,
              prescriptionIds: selectedPrescription.prescriptions,
            },
          },
        });
    }
  };

  function getTotal(
    getThis: 'price' | 'requiredTime',
    prescriptions: PrescriptionWithSelect[]
  ) {
    return prescriptions
      .filter((pre) => pre.isSelect)
      .reduce((prev, curr) => prev + curr[getThis], 0);
  }

  const onClickPrescription = (
    id: number | null,
    prescriptions: PrescriptionWithSelect[],
    selectedPrescriptionData?: PrescriptionWithSelect[]
  ) => {
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
  };

  useEffect(() => {
    return () => {
      setSelectedInfo('patient', null);
    };
  }, []);

  useEffect(() => {
    if (prescriptionsData) {
      let prescriptions =
        prescriptionsData.findPrescriptions.prescriptions?.map((presc) => ({
          ...presc,
          isSelect: false,
        })) ?? [];
      if (selectedPrescriptionData) {
        onClickPrescription(null, prescriptions, selectedPrescriptionData);
      } else {
        setPrescriptions(prescriptions);
      }
    }
  }, [prescriptionsData]);

  useEffect(() => {
    if (reservation) {
      setValue('memo', reservation.memo!);
      setValue('userId', reservation.user.id);
      // @ts-ignore
      setSelectedInfo('patient', reservation.patient);
    } else if (userId) {
      setValue('userId', userId);
    }
  }, [userId, reservation]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-4">
      {isDayOff ? (
        <DayOffForm
          register={register}
          setSelectedStartDateState={setSelectedStartDateState}
          setSelectedEndDateState={setSelectedEndDateState}
          isValid={isValid}
          loading={createLoading && editLoading}
          startDate={reservation?.startDate || selectedStartDateState}
        />
      ) : (
        <>
          {/* <label className="grid grid-cols-[5rem,1fr] items-center"> */}
          <label className="flex flex-col gap-2">
            담당 치료사
            <SelectUser
              members={selectedInfo.clinic?.members ?? []}
              register={register('userId')}
            />
          </label>
          <label className="flex flex-col gap-2">
            시작 시각
            <DatepickerWithInput
              setSelectedDate={setSelectedStartDateState}
              hasHour
              defaultDate={new Date(startDate ?? reservation?.startDate)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-1">
              처방
              <Link to={ROUTES.prescription}>
                <FontAwesomeIcon
                  icon={faLink}
                  fontSize={14}
                  className="btn-menu"
                />
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
            id="memo"
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
            loading={createLoading && editLoading}
          >
            {reservation ? '예약수정' : '예약하기'}
          </Button>

          {createReservationResult?.createReservation.error && (
            <FormError
              errorMessage={createReservationResult.createReservation.error}
            />
          )}
        </>
      )}
    </form>
  );
}
