import { useMutation } from '@apollo/client';
import { CREATE_PATIENT_DOCUMENT } from '../graphql';
import { selectedPatientVar, setToast, useStore } from '../store';
import type { CreatePatientMutation } from '../types/generated.types';
import type { FormForCreatePatientFields } from '../types/form.types';

export const useCreatePatient = () => {
  const clinicId = useStore((state) => state.selectedClinicId);

  const [createMutation, { loading }] = useMutation<CreatePatientMutation>(
    CREATE_PATIENT_DOCUMENT
  );

  const createPatientMutation = (
    { name, gender, memo, birthday }: FormForCreatePatientFields,
    closeAction: () => void
  ) => {
    if (loading) return;

    createMutation({
      variables: {
        input: {
          name,
          gender,
          memo,
          clinicId,
          ...(birthday && { birthday }),
        },
      },
      onCompleted(data) {
        const {
          createPatient: { ok, patient },
        } = data;
        if (ok && patient) {
          setToast({ messages: [`"${patient.name}"님을 등록했습니다`] });
          closeAction();
          selectedPatientVar({ ...patient, user: patient.users?.[0] });
        }
      },
    });
  };

  return { createPatientMutation, loading };
};
