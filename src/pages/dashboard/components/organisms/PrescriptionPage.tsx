import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import useStore from '../../../../hooks/useStore';
import Worning from '../../../../components/atoms/Warning';
import Button from '../../../../components/molecules/Button';
import CardContainer from '../../../../components/templates/CardContainer';
import PrescriptionCard from '../molecules/PrescriptionCard';
import MenuButton from '../../../../components/molecules/MenuButton';
import { FIND_PRESCRIPTIONS_DOCUMENT } from '../../../../graphql';
import type { FindPrescriptionsQuery } from '../../../../models/generated.models';

export interface PrescriptionListProps {
  clinicId: number;
  showInactivate: boolean;
}

function PrescriptionList({ clinicId, showInactivate }: PrescriptionListProps) {
  const { data } = useQuery<FindPrescriptionsQuery>(
    FIND_PRESCRIPTIONS_DOCUMENT,
    {
      variables: {
        input: {
          clinicId,
          onlyLookUpActive: false,
        },
      },
    }
  );

  return (
    <CardContainer>
      {data?.findPrescriptions.prescriptions?.length === 0 ? (
        <Worning type="hasNotPrescription"></Worning>
      ) : (
        data?.findPrescriptions.prescriptions?.map((presc) => {
          if (!showInactivate && !presc.activate) return null;

          return (
            <PrescriptionCard
              key={presc.id}
              prescription={presc}
              clinicId={clinicId}
            />
          );
        })
      )}
    </CardContainer>
  );
}

export default function PrescriptionPage() {
  const { selectedInfo } = useStore();
  const [showInactivate, setShowInactivate] = useState(true);
  const toggleShowInactivate = () => setShowInactivate((prev) => !prev);
  if (!selectedInfo.clinic?.isStayed)
    return <Worning type="hasNotPermission" />;

  return (
    <div className="flex h-full w-full flex-col gap-10">
      <div className="flex gap-10 border-b px-10 py-2">
        <Button
          isSmall
          canClick={selectedInfo.clinic.isManager}
          loading={false}
          type="button"
        >
          <Link to={selectedInfo.clinic.isManager ? 'create-prescription' : ''}>
            만들기
          </Link>
        </Button>
        <MenuButton enabled={!showInactivate} onClick={toggleShowInactivate}>
          비활성숨기기
        </MenuButton>
      </div>

      <section className="px-10">
        <PrescriptionList
          clinicId={selectedInfo.clinic.id}
          showInactivate={showInactivate}
        />
      </section>
      <Outlet />
    </div>
  );
}
