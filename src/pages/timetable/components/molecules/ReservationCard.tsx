import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useDeleteReservationMutation } from '../../../../graphql/generated/graphql';
import { IListReservation } from '../../../../types/type';
import { TimetableModalProps } from '../..';
import ReserveForm from './ReserveForm';
import CreatePatientForm from './CreatePatientForm';
import ReservationCardName from './ReservationCardName';
import ReservationCardPatientDetail from './ReservationCardPatientDetail';
import ReservationCardDetail from './ReservationCardDetail';
import BtnMenuToggle from '../../../../components/molecules/MenuToggleButton';
import MenuButton from '../../../../components/molecules/MenuButton';

interface ReservationCardProps extends TimetableModalProps {
  reservation: IListReservation;
}

export default function ReservationCard({
  closeAction,
  reservation,
}: ReservationCardProps) {
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
    setSubMenu(menu);
    setIsEdit(false);
  };

  const toggleMenu = () => {
    setSubMenu((prev) => (prev === 'reservation' ? 'patient' : 'reservation'));
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

      <BtnMenuToggle
        firstEnabled={subMenu === 'reservation'}
        secondEnabled={subMenu === 'patient'}
        label={['예약', '환자정보']}
        width={'full'}
        onClick={toggleMenu}
      />

      <div className="reservation-editor flex justify-around">
        <MenuButton
          icon={<FontAwesomeIcon icon={faTrashCan} fontSize={14} />}
          enabled={!isEdit && subMenu === 'reservation'}
          label={'삭제'}
          onClick={
            !isEdit && subMenu === 'reservation' ? onClickDelete : undefined
          }
        />
        <MenuButton
          icon={<FontAwesomeIcon icon={faEdit} fontSize={14} />}
          enabled={isEdit}
          label={'수정'}
          onClick={() => setIsEdit((prev) => !prev)}
        />
      </div>

      <div className="h-full overflow-y-scroll">
        {subMenu === 'reservation' && !isEdit && (
          <ReservationCardDetail reservation={reservation} />
        )}
        {subMenu === 'reservation' && isEdit && (
          <ReserveForm
            userId={reservation.user.id}
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
}
