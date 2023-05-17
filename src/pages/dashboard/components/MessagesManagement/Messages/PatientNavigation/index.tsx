import { usePatientNavigation } from './usePatientNavigation';
import { DateRange } from '..';
import { SearchBar } from './SearchBar';
import { PatientList } from './PatientList';

interface PatientNavigationProps {
  dates: DateRange;
}

export const PatientNavigation = ({ dates }: PatientNavigationProps) => {
  const { patients, hasMorePage, fetchMore, handleSubmit } =
    usePatientNavigation({ dates });

  return (
    <div className="w-96 min-w-[20rem] px-2 py-2">
      <SearchBar handleSubmit={handleSubmit} />
      <PatientList
        patients={patients}
        hasMorePage={hasMorePage}
        fetchMore={fetchMore}
      />
    </div>
  );
};
