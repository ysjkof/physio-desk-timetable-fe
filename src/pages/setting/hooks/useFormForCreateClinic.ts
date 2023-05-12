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
    const { name, phone } = data;
    if (!name) return;
    if (!Number.isInteger(Number.parseInt(phone || '', 10)))
      throw Error('연락처는 숫자만 입력 가능합니다');

    createClinic({
      variables: { input: { name: name.trim(), ...(phone && { phone }) } },
    });
  };

  const handleSubmit = handleSubmitWrapper(onSubmit);

  const nameError =
    errors.name?.type === 'pattern' && REG_EXP.clinicName.condition;
  const phoneError =
    errors.phone?.type === 'minLength' || errors.phone?.type === 'maxLength'
      ? '연락처는 9~11자리입니다'
      : undefined;
  const error = { nameError, phoneError };

  return { register, handleSubmit, error };
};

export default useFormForCreateClinic;
