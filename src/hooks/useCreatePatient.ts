import { useMutation } from '@apollo/client';
import { ClinicsOfClient } from '../models';
import { CreatePatientMutation } from '../types/generated.types';
import { CREATE_PATIENT_DOCUMENT } from '../graphql';
import { selectedPatientVar, toastVar } from '../store';
import { FormForCreatePatientFields } from '../types/form.types';

export const useCreatePatient = () => {
  const selectedClinic = ClinicsOfClient.getSelectedClinic();

  const [createMutation, { loading }] = useMutation<CreatePatientMutation>(
    CREATE_PATIENT_DOCUMENT
  );

  const createPatientMutation = (
    { name, gender, memo, birthday }: FormForCreatePatientFields,
    closeAction: () => void
  ) => {
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
          toastVar({ messages: [`"${patient.name}"님을 등록했습니다`] });
          closeAction();
          selectedPatientVar({ ...patient, user: patient.users?.[0] });
        }
      },
    });
  };

  return { createPatientMutation, loading };
};
