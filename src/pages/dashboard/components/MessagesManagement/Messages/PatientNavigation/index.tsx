import { usePatientNavigation } from './usePatientNavigation';
import { PatientList } from './PatientList';
import { MessageFilter } from '../MessageFilter';
import { useContext } from 'react';
import { MessagesContext } from '../MessagesContext';

export const PatientNavigation = () => {
  const dates = useContext(MessagesContext).dateRange;
  const { patients, hasMorePage, fetchMore } = usePatientNavigation({ dates });

  return (
    <div className="w-96 min-w-[20rem] py-2 flex flex-col">
      <MessageFilter />
      <PatientList
        patients={patients}
        hasMorePage={hasMorePage}
        fetchMore={fetchMore}
      />
    </div>
  );
};

// interface SearchBarProps {
//   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
// }

// export const SearchBar = ({ handleSubmit }: SearchBarProps) => {
//   return (
//     <form onSubmit={handleSubmit} className="relative mb-3 grow">
//       <input type="search" className="input pl-9" />
//       <button className="position-center-y absolute left-3 p-1" type="submit">
//         <FontAwesomeIcon icon={faMagnifyingGlass} />
//       </button>
//     </form>
//   );
// };
