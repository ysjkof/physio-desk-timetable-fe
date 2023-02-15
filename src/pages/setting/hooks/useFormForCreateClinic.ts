import { SubmitHandler, useForm } from 'react-hook-form';
import { useCreateClinic } from '../../../hooks';
import { REG_EXP } from '../../../constants/regex';
import type { FormForCreateClinicFields } from '../../../types/formTypes';

const useFormForCreateClinic = () => {
  const {
    register,
    handleSubmit: handleSubmitWrapper,
    formState: { errors },
  } = useForm<FormForCreateClinicFields>({ mode: 'onChange' });

  const [createClinic] = useCreateClinic();

  const onSubmit: SubmitHandler<FormForCreateClinicFields> = (data) => {
    const { name } = data;
    if (!name) return;

    createClinic({ variables: { input: { name: name.trim() } } });
  };

  const handleSubmit = handleSubmitWrapper(onSubmit);

  const nameError =
    errors.name?.type === 'pattern' && REG_EXP.clinicName.condition;
  const error = { nameError };

  return { register, handleSubmit, error };
};

export default useFormForCreateClinic;
