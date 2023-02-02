import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useOutletContext } from 'react-router-dom';
import { FIND_PRESCRIPTIONS_DOCUMENT } from '../../../../graphql';
import { ClinicsOfClient } from '../../../../models';
import PrescriptionManagementHeader from './PrescriptionManagementHeader';
import PrescriptionItemHeader from './PrescriptionItemHeader';
import PrescriptionItem from './PrescriptionItem';
import type { DashboardOutletContext } from '../../../../types/common.types';
import type {
  FindPrescriptionsQuery,
  FindPrescriptionsQueryVariables,
} from '../../../../types/generated.types';

const PrescriptionManagement = () => {
  const { outletWidth } = useOutletContext<DashboardOutletContext>();
  const clinicId = ClinicsOfClient.getSelectedClinic().id;
  const [hasInactivate, setHasInactivate] = useState(false);

  const { data } = useQuery<
    FindPrescriptionsQuery,
    FindPrescriptionsQueryVariables
  >(FIND_PRESCRIPTIONS_DOCUMENT, {
    variables: {
      input: {
        clinicId,
        onlyLookUpActive: hasInactivate,
      },
    },
  });

  return (
    <div
      className="whitespace-nowrap bg-[#F9F9FF] p-10"
      style={{ width: outletWidth }}
    >
      <PrescriptionManagementHeader
        seeInactivate={hasInactivate}
        setSeeInactivate={setHasInactivate}
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
          />
        ))}
      </div>
    </div>
  );
};

export default PrescriptionManagement;
