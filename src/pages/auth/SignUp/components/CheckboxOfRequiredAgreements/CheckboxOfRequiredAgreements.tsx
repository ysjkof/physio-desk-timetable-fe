import { type UseFormRegisterReturn } from 'react-hook-form';
import FormError from '../../../../../components/FormError';
import { Link } from 'react-router-dom';
import {
  SIGN_UP_AGREEMENTS,
  TERM_AND_CONDITIONS,
} from '../../../../../router/routes';

const RequiredAgreementsCheckbox = (props: {
  register: UseFormRegisterReturn;
  error?: string;
}) => {
  return (
    <label
      className="relative flex cursor-pointer select-none items-center whitespace-nowrap py-1.5 pl-5 text-xs"
      htmlFor="requiredAgreements"
    >
      <input
        id="requiredAgreements"
        {...props.register}
        type="checkbox"
        className="check mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat py-1 transition duration-200 checked:border-cst-blue checked:bg-cst-blue checked:bg-check-white"
      />
      <strong>(필수)</strong>
      <Link
        to={TERM_AND_CONDITIONS}
        className="ml-1 font-bold text-blue-500 hover:font-extrabold hover:text-blue-600"
      >
        서비스 이용약관
      </Link>
      과{' '}
      <Link
        to={SIGN_UP_AGREEMENTS}
        className="ml-1 font-bold text-blue-500 hover:font-extrabold hover:text-blue-600"
      >
        개인정보 수집/이용
      </Link>
      에 동의합니다
      <FormError top="1.1rem" error={props.error || ''} />
    </label>
  );
};

export default RequiredAgreementsCheckbox;
