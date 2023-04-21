import { usePolicies } from './usePolicies';

const SignUpAgreements = () => {
  const __html = usePolicies('개인정보_수집_이용_동의_URL');

  return (
    <div className="prose mx-auto my-14" dangerouslySetInnerHTML={{ __html }} />
  );
};

export default SignUpAgreements;
