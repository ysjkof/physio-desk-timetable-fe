import { useFindPrescriptionsQuery } from '../../../../graphql/generated/graphql';
import useStore from '../../../../hooks/useStore';
import PrescriptionCard from '../molecules/PrescriptionCard';
import CardContainer from '../../../../components/templates/CardContainer';
import Worning from '../../../../components/atoms/Warning';

export default function PrescriptionList() {
  const { selectedInfo } = useStore();
  const { data } = useFindPrescriptionsQuery({
    variables: {
      input: {
        clinicId: selectedInfo.clinic ? selectedInfo.clinic.id : 0,
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
          <PrescriptionCard key={presc.id} prescription={presc} />
        ))
      )}
    </CardContainer>
  );
}
