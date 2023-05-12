import { useMutation } from '@apollo/client';
import { CREATE_PATIENT_DOCUMENT } from '../graphql';
import { setAlert, useStore } from '../store';
import { getDateFromStr8Digit } from '../utils/dateUtils';
import type {
  CreatePatientMutation,
  CreatePatientMutationVariables,
} from '../types/generatedTypes';
import type { FormForCreatePatientFields } from '../types/formTypes';

export const useCreatePatient = () => {
  const clinicId = useStore((state) => state.pickedClinicId);

  const [createMutation, { loading }] = useMutation<
    CreatePatientMutation,
    CreatePatientMutationVariables
  >(CREATE_PATIENT_DOCUMENT);

  const createPatientMutation = (
    { name, gender, memo, birthday, phone }: FormForCreatePatientFields,
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
          ...(birthday && { birthday: getDateFromStr8Digit(String(birthday)) }),
          ...(phone && { phone: '' + phone }),
        },
      },
      onCompleted(data) {
        const {
          createPatient: { ok, patient },
        } = data;
        if (ok && patient) {
          setAlert({
            messages: [`"${patient.name}"님을 등록했습니다`],
            isPositive: true,
          });
          closeAction();
        }
      },
    });
  };

  return { createPatientMutation, loading };
};
