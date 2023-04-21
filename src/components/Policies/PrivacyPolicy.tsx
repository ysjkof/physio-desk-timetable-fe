import { usePolicies } from './usePolicies';

const PrivacyPolicy = () => {
  const __html = usePolicies('개인정보_처리방침_URL');

  return (
    <div className="prose mx-auto my-14" dangerouslySetInnerHTML={{ __html }} />
  );
};

export default PrivacyPolicy;
