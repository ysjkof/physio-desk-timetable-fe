import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrescriptionManagementHeader from './PrescriptionManagementHeader';
import PrescriptionItemHeader from './PrescriptionItemHeader';
import PrescriptionItem from './PrescriptionItem';
import { CreatePrescription } from '../CreatePrescription';
import EditPrescription from '../EditPrescription/EditPrescription';
import { useStore } from '../../../../store';
import { useFindPrescriptions } from '../../../../hooks';

const PrescriptionManagement = () => {
  const [showInactivate, setShowInactivate] = useState(false);

  const clinicId = useStore((state) => state.pickedClinicId);

  const [queryData] = useFindPrescriptions();

  const { pathname } = useLocation();
  const hasCreate = pathname.endsWith('/create');
  const hasEdit = pathname.endsWith('/edit');

  const navigate = useNavigate();
  const closeAction = () => {
    navigate(-1);
  };

  return (
    <div className="grow whitespace-nowrap bg-[#F9F9FF] p-10">
      <PrescriptionManagementHeader
        seeInactivate={showInactivate}
        setSeeInactivate={setShowInactivate}
        count={queryData?.count}
        maximumCount={queryData?.maximumCount}
      />
      <PrescriptionItemHeader />
      <div
        className="prescription-management-item-container"
        style={{ height: 'calc(100% - 92px)' }}
      >
        {queryData?.prescriptions?.map((prescription) => (
          <PrescriptionItem
            key={prescription.id}
            prescription={prescription}
            clinicId={clinicId}
            showInactivate={showInactivate}
          />
        ))}
      </div>
      {hasCreate && <CreatePrescription closeAction={closeAction} />}
      {hasEdit && <EditPrescription closeAction={closeAction} />}
    </div>
  );
};

export default PrescriptionManagement;
