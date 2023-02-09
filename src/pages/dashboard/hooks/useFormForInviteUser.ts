import { type SubmitHandler, useForm } from 'react-hook-form';
import { useReactiveVar } from '@apollo/client';
import { loggedInUserVar } from '../../../store';
import { useInviteUser } from '../../../hooks';
import { ClinicsOfClient } from '../../../models';
import { REG_EXP } from '../../../constants/regex';

interface UseFormForInviteUserFields {
  name: string;
}

export const useFormForInviteUser = () => {
  const loggedInUser = useReactiveVar(loggedInUserVar);
  const clinicId = ClinicsOfClient.getSelectedClinic().id;

  const {
    register,
    handleSubmit: handleSubmitWrapper,
    formState: { errors },
  } = useForm<UseFormForInviteUserFields>({ mode: 'onChange' });

  const [inviteUser] = useInviteUser();

  const onSubmit: SubmitHandler<UseFormForInviteUserFields> = (data) => {
    if (!loggedInUser) return;

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
