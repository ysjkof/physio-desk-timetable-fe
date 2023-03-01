import { InputWrapper, MenuButton } from '../../../../components';
import { REG_EXP } from '../../../../constants/regex';
import { Input } from '../../../../components';
import useFormForCreateClinic from '../../hooks/useFormForCreateClinic';

const FormForCreateClinic = () => {
  const { register, handleSubmit, error } = useFormForCreateClinic();

  return (
    <form onSubmit={handleSubmit}>
      <InputWrapper
        label="병원 이름"
        htmlFor="병원 이름"
        align="col"
        error={error.nameError}
      >
        <Input
          id="병원이름"
          register={register('name', { pattern: REG_EXP.clinicName.pattern })}
        />
      </InputWrapper>

      <MenuButton
        onClick={handleSubmit}
        type="submit"
        className="mt-6 w-36 rounded-md bg-cst-blue py-6 text-base font-medium text-white"
      >
        만들기
      </MenuButton>
    </form>
  );
};

export default FormForCreateClinic;
