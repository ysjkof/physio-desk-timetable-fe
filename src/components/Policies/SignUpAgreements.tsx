import { usePolicies } from './usePolicies';

const SignUpAgreements = () => {
  const __html = usePolicies('SIGN_UP_AGREEMENTS');

  return (
    <div className="prose mx-auto my-14" dangerouslySetInnerHTML={{ __html }} />
  );
};

export default SignUpAgreements;
