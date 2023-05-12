import { useSendMessage } from './useSendMessage';
import { PatientSelector } from './PatientSelector';
import { FormForSendMessage } from './FormForSendMessage';

const SendMessage = () => {
  const {
    clinicPhone,
    patient,
    setPatient,
    preview,
    changeInputMessage,
    handleSubmit,
    bytes,
    defaultMessage,
  } = useSendMessage();

  // <병원이름>
  // <환자이름>
  // <예약 시각>
  // <처방>

  return (
    <div className="flex h-full max-w-4xl flex-col gap-y-6">
      <div className="rounded-md border bg-white px-8 py-4">
        <TitleWithContent title="병원연락처" content={clinicPhone} />
      </div>
      <PatientSelector setPatient={setPatient} patient={patient} />
      <FormForSendMessage
        handleSubmit={handleSubmit}
        changeInputMessage={changeInputMessage}
        defaultMessage={defaultMessage}
        bytes={bytes}
        preview={preview}
      />
    </div>
  );
};

export default SendMessage;

export const TitleWithContent = ({
  title,
  content,
}: {
  title: string;
  content: string | undefined | null | number;
}) => {
  return (
    <div>
      <span>{title} : </span>
      <span>{content}</span>
    </div>
  );
};
