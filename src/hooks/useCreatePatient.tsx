import { useMutation } from '@apollo/client';
import { ClinicsOfClient } from '../models';
import { CreatePatientMutation } from '../types/generated.types';
import { CREATE_PATIENT_DOCUMENT } from '../graphql';
import { selectedPatientVar, toastVar } from '../store';
import { CreatePatientForm } from '../types/form.types';

export const useCreatePatient = () => {
  const { selectedClinic } = ClinicsOfClient;

  const [createMutation, { loading }] = useMutation<CreatePatientMutation>(
    CREATE_PATIENT_DOCUMENT
  );

  const createPatientMutation = (
    { name, gender, memo, birthday }: CreatePatientForm,
    closeAction: () => void
  ) => {
    console.log(name, gender, memo, birthday);

    if (loading) return;
    if (!selectedClinic) throw new Error('선택된 병원이 없습니다');

    createMutation({
      variables: {
        input: {
          name,
          gender,
          memo,
          clinicId: selectedClinic.id,
          ...(birthday && { birthday }),
        },
      },
      onCompleted(data) {
        const {
          createPatient: { ok, patient },
        } = data;
        if (ok && patient) {
          toastVar({ messages: [`"${patient?.name}"님을 등록했습니다`] });
          closeAction();
          // 할일: 선택된환자 형태로 가공하고 적용하기
          selectedPatientVar({ ...patient, user: patient.users[0] });
        }
      },
    });
  };

  return { createPatientMutation, loading };
};
