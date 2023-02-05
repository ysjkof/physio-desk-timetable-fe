import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { FIND_PRESCRIPTIONS_DOCUMENT } from '../../../../graphql';
import { ClinicsOfClient } from '../../../../models';
import PrescriptionManagementHeader from './PrescriptionManagementHeader';
import PrescriptionItemHeader from './PrescriptionItemHeader';
import PrescriptionItem from './PrescriptionItem';
import { CreatePrescription } from '../CreatePrescription';
import type { DashboardOutletContext } from '../../../../types/common.types';
import type {
  FindPrescriptionsQuery,
  FindPrescriptionsQueryVariables,
} from '../../../../types/generated.types';
import EditPrescription from '../EditPrescription/EditPrescription';

const PrescriptionManagement = () => {
  const { outletWidth } = useOutletContext<DashboardOutletContext>();
  const clinicId = ClinicsOfClient.getSelectedClinic().id;
  const [showInactivate, setShowInactivate] = useState(false);

  const { data } = useQuery<
    FindPrescriptionsQuery,
    FindPrescriptionsQueryVariables
  >(FIND_PRESCRIPTIONS_DOCUMENT, {
    variables: {
      input: {
        clinicId,
        onlyLookUpActive: false,
      },
    },
  });

  const { pathname } = useLocation();
  const hasCreate = pathname.endsWith('/create');
  const hasEdit = pathname.endsWith('/edit');

  const navigate = useNavigate();
  const closeAction = () => {
    navigate(-1);
  };

  return (
    <div
      className="whitespace-nowrap bg-[#F9F9FF] p-10"
      style={{ width: outletWidth }}
    >
      <PrescriptionManagementHeader
        seeInactivate={showInactivate}
        setSeeInactivate={setShowInactivate}
      />
      <PrescriptionItemHeader />
      <div
        className="prescription-management-item-container"
        style={{ height: 'calc(100% - 92px)' }}
      >
        {data?.findPrescriptions.prescriptions?.map((prescription) => (
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
