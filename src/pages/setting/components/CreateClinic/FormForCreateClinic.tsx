import { InputWrapper, MenuButton } from '../../../../components';
import { REG_EXP } from '../../../../constants/regex';
import { Input } from '../../../../components';
import useFormForCreateClinic from '../../hooks/useFormForCreateClinic';

const FormForCreateClinic = () => {
  const { register, handleSubmit, error } = useFormForCreateClinic();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputWrapper
        label="병원 이름"
        htmlFor="병원 이름"
        align="col"
        required
        error={error.nameError}
      >
        <Input
          id="병원이름"
          register={register('name', { pattern: REG_EXP.clinicName.pattern })}
        />
      </InputWrapper>
      <InputWrapper
        label="연락처"
        htmlFor="연락처"
        align="col"
        error={error.phoneError}
      >
        <Input
          id="연락처"
          type="number"
          register={register('phone', { maxLength: 11, minLength: 9 })}
          placeholder="전화번호 숫자만 입력(01012345678)"
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
