import Button from '../../../../_legacy_components/molecules/Button';

interface SearchNavigationProps {
  invokeQuery: () => void;
  loading: boolean;
}

export const SearchNavigation = ({
  invokeQuery,
  loading,
}: SearchNavigationProps) => {
  return (
    <div className="flex justify-between border-b px-6 py-2">
      <h1 className="text-base font-bold">환자 검색</h1>
      <Button canClick isSmall onClick={invokeQuery} loading={loading}>
        검색
      </Button>
    </div>
  );
};
