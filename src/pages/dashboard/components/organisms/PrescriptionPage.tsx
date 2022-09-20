import useStore from '../../../../hooks/useStore';
import Worning from '../../../../components/atoms/Warning';
import { Link, Outlet } from 'react-router-dom';
import Button from '../../../../components/molecules/Button';
import { useFindPrescriptionsQuery } from '../../../../graphql/generated/graphql';
import CardContainer from '../../../../components/templates/CardContainer';
import PrescriptionCard from '../molecules/PrescriptionCard';

function PrescriptionList({ clinicId }: { clinicId: number }) {
  const { data } = useFindPrescriptionsQuery({
    variables: {
      input: {
        clinicId,
        onlyLookUpActive: false,
      },
    },
  });

  return (
    <CardContainer>
      {data?.findPrescriptions.prescriptions?.length === 0 ? (
        <Worning type="hasNotPrescription"></Worning>
      ) : (
        data?.findPrescriptions.prescriptions?.map((presc) => (
          <PrescriptionCard
            key={presc.id}
            prescription={presc}
            clinicId={clinicId}
          />
        ))
      )}
    </CardContainer>
  );
}

export default function PrescriptionPage() {
  const { selectedInfo } = useStore();

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
      </div>

      <section className="px-10">
        <PrescriptionList clinicId={selectedInfo.clinic.id} />
      </section>
      <Outlet />
    </div>
  );
}
