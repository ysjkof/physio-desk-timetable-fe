import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useGetClinic } from '../../../../../hooks';
import { ClinicType } from '../../../../../types/generatedTypes';
import { formatPhoneNumber } from '../../../../../utils/commonUtils';
import { PatientInSearch } from '../../../../../types/processedGeneratedTypes';
import { setAlert } from '../../../../../store';
import { useSendMessageMutation } from '../../../hooks/useSendMessageMutation';

export const useSendMessage = () => {
  const [sendMessage] = useSendMessageMutation();

  const [clinic] = useGetClinic();

  const [patient, setPatient] = useState<PatientInSearch>();

  const defaultMessage = `안녕하세요, <환자>님. <병원>입니다.`;

  const [preview, setPreview] = useState('');

  const clinicPhone = formatPhoneNumber(clinic?.phone);

  const changeInputMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = event.target.value;
    if (!newMessage) return setPreview('');
    setPreview(convertPreview(newMessage));
  };

  const convertPreview = (_message: string) => {
    let message = _message;
    const CLINIC_NAME =
      clinic?.type === ClinicType.Personal
        ? clinic?.name.split(':')[0]
        : clinic?.name || '';
    const PATIENT_NAME = patient?.name;
    const clinicContact = clinicPhone ? `(${clinicPhone})` : '';
    const surfix = `통화가 필요한 경우 병원연락처${clinicContact}로 연락바랍니다. 발신번호는 응답을 할 수 없습니다.`;

    message = message.replaceAll('<병원>', CLINIC_NAME);
    if (PATIENT_NAME) message = message.replaceAll('<환자>', PATIENT_NAME);

    return `${message}\n${surfix}`;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const to = patient?.phone;
    if (!to) return setAlert({ messages: ['환자 전화번호가 없습니다'] });
    const content = preview;
    sendMessage(content, to);
  };

  const encoder = new TextEncoder();
  const bytes = encoder.encode(preview).byteLength;

  useEffect(() => {
    if (!clinic || !patient) return;
    setPreview(convertPreview(defaultMessage));
  }, [clinic, patient]);

  return {
    clinicPhone,
    patient,
    setPatient,
    preview,
    changeInputMessage,
    handleSubmit,
    bytes,
    defaultMessage,
  };
};
