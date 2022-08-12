import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { ReservationCardName } from '../molecules/ReservationCardName';
import { ReservationCardPatientDetail } from '../molecules/ReservationCardPatientDetail';
import { TimetableModalProps } from '../../pages/timetable';
import { useDeleteReservationMutation } from '../../graphql/generated/graphql';
import { ReservationCardDetail } from '../molecules/ReservationCardDetail';
import { BtnMenuToggle } from '../molecules/MenuToggleButton';
import { MenuButton } from '../molecules/MenuButton';
import { ReserveForm } from '../../pages/timetable/molecules/ReserveForm';
import { CreatePatientForm } from '../molecules/CreatePatientForm';
import { IListReservation } from '../../types/type';

interface ReservationCardProps extends TimetableModalProps {
  reservation: IListReservation;
}

export const ReservationCard = ({
  closeAction,
  reservation,
}: ReservationCardProps) => {
  const [subMenu, setSubMenu] = useState<'reservation' | 'patient'>(
    'reservation'
  );
  const [isEdit, setIsEdit] = useState(false);

  const [deleteReservationMutation] = useDeleteReservationMutation({});

  const onClickDelete = () => {
    const confirmDelete = window.confirm('예약을 지웁니다.');
    if (confirmDelete) {
      deleteReservationMutation({
        variables: { input: { reservationId: reservation.id } },
        onCompleted(data) {
          const {
            deleteReservation: { ok },
          } = data;
          if (ok) {
            closeAction();
          }
        },
      });
    }
  };

  const changeSubmenu = (menu: typeof subMenu) => {
    setSubMenu((prev) => (prev === 'patient' ? 'reservation' : 'patient'));
    setIsEdit(false);
  };

  return reservation.patient ? (
    <div className="space-y-4">
      <h4 className="mb-5 text-left font-medium"></h4>
      <ReservationCardName
        birthday={reservation.patient.birthday}
        gender={reservation.patient.gender}
        name={reservation.patient.name}
        registrationNumber={reservation.patient.registrationNumber}
      />

      <div className="reservation-editor flex justify-around">
        <MenuButton
          icon={<FontAwesomeIcon icon={faTrashCan} fontSize={14} />}
          enabled
          label={'삭제'}
          onClick={onClickDelete}
        />
        <MenuButton
          icon={<FontAwesomeIcon icon={faEdit} fontSize={14} />}
          enabled={isEdit}
          label={'수정'}
          onClick={() => setIsEdit((prev) => !prev)}
        />
      </div>

      <BtnMenuToggle
        firstEnabled={subMenu === 'reservation'}
        secondEnabled={subMenu === 'patient'}
        label={['예약', '환자정보']}
        width={'full'}
        onClick={() =>
          setSubMenu((prev) =>
            prev === 'reservation' ? 'patient' : 'reservation'
          )
        }
      />

      <div className="h-full overflow-y-scroll">
        {subMenu === 'reservation' && !isEdit && (
          <ReservationCardDetail reservation={reservation} />
        )}
        {subMenu === 'reservation' && isEdit && (
          <ReserveForm
            closeAction={() => changeSubmenu('reservation')}
            selectedPrescriptionData={reservation.prescriptions?.map(
              (prev) => ({
                ...prev,
                isSelect: true,
              })
            )}
            reservation={reservation}
          />
        )}

        {subMenu === 'patient' && !isEdit && (
          <ReservationCardPatientDetail
            birthday={reservation.patient.birthday}
            gender={reservation.patient.gender}
            name={reservation.patient.name}
            registrationNumber={reservation.patient.registrationNumber}
            memo={reservation.patient.memo}
          />
        )}
        {subMenu === 'patient' && isEdit && (
          <CreatePatientForm
            patient={reservation.patient}
            closeAction={() => null}
          />
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};