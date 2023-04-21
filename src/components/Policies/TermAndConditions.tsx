import { usePolicies } from './usePolicies';

const TermAndConditions = () => {
  const __html = usePolicies('서비스_이용약관_URL');

  return (
    <div className="prose mx-auto my-14" dangerouslySetInnerHTML={{ __html }} />
  );
};

export default TermAndConditions;
