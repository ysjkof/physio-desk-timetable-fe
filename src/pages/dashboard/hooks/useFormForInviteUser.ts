import { type SubmitHandler, useForm } from 'react-hook-form';
import { useInviteUser } from '../../../hooks';
import { REG_EXP } from '../../../constants/regex';
import { useStore } from '../../../store';

interface UseFormForInviteUserFields {
  name: string;
}

export const useFormForInviteUser = () => {
  const clinicId = useStore((state) => state.selectedClinicId);

  const {
    register,
    handleSubmit: handleSubmitWrapper,
    formState: { errors },
  } = useForm<UseFormForInviteUserFields>({ mode: 'onChange' });

  const [inviteUser] = useInviteUser();

  const onSubmit: SubmitHandler<UseFormForInviteUserFields> = (data) => {
    const { name } = data;
    if (!name) return;

    inviteUser({ variables: { input: { clinicId, name } } });
  };

  const handleSubmit = handleSubmitWrapper(onSubmit);

  const nameError =
    errors.name?.type === 'pattern' && REG_EXP.personName.condition;
  const error = { nameError };

  return { register, handleSubmit, error };
};
