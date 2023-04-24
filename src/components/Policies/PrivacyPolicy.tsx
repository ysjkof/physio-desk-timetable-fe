import { usePolicies } from './usePolicies';

const PrivacyPolicy = () => {
  const __html = usePolicies('PRIVACY_POLICY');

  return (
    <div className="prose mx-auto my-14" dangerouslySetInnerHTML={{ __html }} />
  );
};

export default PrivacyPolicy;
