import { useEffect, useState } from 'react';
import { useReactiveVar } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { selectedInfoVar } from '../../../../store';
import SelectUser from './SelectUser';
import Button from '../../../../_legacy_components/molecules/Button';
import Input from '../../../../_legacy_components/molecules/Input';
import Datepicker from '../../../../_legacy_components/molecules/Datepicker/Datepicker';
import { TimetableModalProps } from '../../Timetable';
import { useDayoff } from '../../hooks';
import { createDate } from '../../../../services/dateServices';
import { ClinicsOfClient } from '../../../../models';
import type {
  IListReservation,
  ReserveFormType,
} from '../../../../types/common.types';

interface DayOffFormNewProps extends TimetableModalProps {
  userId: number;
  startDate?: Date;
  reservation?: IListReservation;
}
export default function DayOffForm({
  userId,
  startDate,
  reservation,
  closeAction,
}: DayOffFormNewProps) {
  const { selectedClinic } = ClinicsOfClient;
  const selectedInfo = useReactiveVar(selectedInfoVar);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    reservation?.startDate ? new Date(reservation.startDate) : startDate
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    reservation?.endDate ? new Date(reservation.endDate) : undefined
  );

  const {
    register,
    getValues,
    formState: { isValid },
    handleSubmit,
    setValue,
  } = useForm<ReserveFormType>({
    mode: 'onChange',
  });

  const { createDayoff, editDayoff, loading } = useDayoff({
    isCreate: false,
    closeAction,
  });

  const onSubmit = () => {
    if (loading) return;
    if (!selectedEndDate) throw new Error('endDate가 없습니다.');
    const { memo, userId } = getValues();

    if (reservation) {
      editDayoff({
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        memo,
        userId,
        reservationId: reservation.id,
      });
      return;
    }

    createDayoff({
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      memo,
      userId,
      clinicId: selectedClinic.id,
    });
  };

  useEffect(() => {
    if (reservation) {
      const { memo, user } = reservation;
      setValue('memo', memo || '');
      setValue('userId', user.id);
      return;
    }

    setValue('userId', userId);
  }, [userId, reservation]);

  const createDefaultEndDate = () => {
    if (!startDate) return;
    const time = {
      hour: startDate.getHours() + 3,
      minute: 0,
    };
    return createDate(startDate, time);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-4">
      <label className="flex flex-col gap-2">
        치료사
        <SelectUser
          members={selectedClinic.members}
          register={register('userId')}
        />
      </label>
      <label className="flex flex-col gap-2">
        시작 시각
        <Datepicker
          setSelectedDate={setSelectedStartDate}
          hasHour
          defaultDate={selectedStartDate}
        />
      </label>
      <label className="flex flex-col gap-2">
        종료 시각
        <Datepicker
          setSelectedDate={setSelectedEndDate}
          hasHour
          defaultDate={selectedEndDate || createDefaultEndDate()}
        />
      </label>

      <Input
        id="day-off-form__memo"
        label="메모"
        placeholder="간단한 남길 말"
        register={register('memo', {
          maxLength: { value: 200, message: '최대 200자입니다' },
        })}
        type={'textarea'}
      />
      <Button type="submit" canClick={isValid} loading={loading}>
        잠금 수정
      </Button>
    </form>
  );
}
