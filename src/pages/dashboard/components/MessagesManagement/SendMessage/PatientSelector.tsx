import { formatPhoneNumber } from '../../../../../utils/commonUtils';
import { usePatientSelector } from './usePatientSelector';
import { SearchPatientFormOfMessage } from './SearchPatientFormOfMessage';
import { TitleWithContent } from './SendMessage';
import { PatientInSearch } from '../../../../../types/processedGeneratedTypes';

interface PatientSelectorProps {
  setPatient: React.Dispatch<React.SetStateAction<PatientInSearch | undefined>>;
  patient: PatientInSearch | undefined;
}

export const PatientSelector = ({
  setPatient,
  patient,
}: PatientSelectorProps) => {
  const { patients, handleInputOnChange, hasMorePages, plusPage } =
    usePatientSelector();

  return (
    <div className="space-y-4 rounded-md border bg-white px-8 py-4">
      <h3 className="">받는 사람</h3>

      <SearchPatientFormOfMessage
        patients={patients}
        setPatient={setPatient}
        handleInputOnChange={handleInputOnChange}
        enabled={!patient}
        hasMorePages={hasMorePages}
        plusPage={plusPage}
      />

      <div className="space-y-1">
        <TitleWithContent title="이름" content={patient?.name} />
        <TitleWithContent
          title="등록번호"
          content={patient?.registrationNumber}
        />
        <TitleWithContent
          title="전화번호"
          content={formatPhoneNumber(patient?.phone)}
        />
      </div>
    </div>
  );
};
