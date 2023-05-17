import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useGetClinic } from '../../../../../../hooks';
import {
  formatPhoneNumber,
  getByteLength,
} from '../../../../../../utils/commonUtils';
import { useSendMessageMutation } from '../../../../hooks/useSendMessageMutation';
import { ClinicType } from '../../../../../../types/generatedTypes';
import { type PatientAtMessage } from '..';

export const useSendMessageForm = (patient: PatientAtMessage | undefined) => {
  const [sendMessage] = useSendMessageMutation();
  const [preview, setPreview] = useState('');
  const [inputHeight, setInputHeight] = useState<number>();
  const [clinic] = useGetClinic();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patient) throw new Error('patient is undefined');
    const content = preview;
    const patientId = patient.id;
    sendMessage({ content, patientId });
  };

  const changeInputMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const message = event.target.value;
    if (!message) return setPreview('');
    setPreview(
      convertPreview({
        message,
        clinicName: getClinicName(clinic?.name, clinic?.type),
        clinicPhone: clinic?.phone,
        patientName: patient?.name,
      })
    );
  };

  const clearAll = () => {
    setPreview('');
    setInputHeight(0);
  };

  useEffect(() => {
    clearAll();
  }, [patient]);

  return {
    preview,
    bytes: getByteLength(preview),
    inputHeight,
    setInputHeight,
    changeInputMessage,
    handleSubmit,
  };
};

const convertPreview = (input: {
  message: string;
  clinicName: string;
  clinicPhone: string | undefined | null;
  patientName: string | undefined | null;
}) => {
  let message = input.message;
  const { clinicName, clinicPhone, patientName } = input;
  const CLINIC_CONTACT = clinicPhone
    ? `(${formatPhoneNumber(clinicPhone)})`
    : '';

  message = message.replaceAll('<병원>', clinicName);
  if (patientName) message = message.replaceAll('<환자>', patientName);

  const surfix = `통화가 필요한 경우 병원연락처${CLINIC_CONTACT}로 연락바랍니다. 발신번호는 응답을 할 수 없습니다.`;
  return `${message}\n${surfix}`;
};

const getClinicName = (
  name: string | undefined,
  type: ClinicType | undefined
) => (name && type === ClinicType.Personal ? name.split(':')[0] : name || '');
