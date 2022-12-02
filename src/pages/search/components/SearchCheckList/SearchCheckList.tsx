import { useReactiveVar } from '@apollo/client';
import { UseFormRegister } from 'react-hook-form';
import { clinicListsVar } from '../../../../store';
import { renameUseSplit } from '../../../../utils/common.utils';
import Checkbox from '../../../../_legacy_components/molecules/Checkbox';

export const SearchCheckList = ({
  selectedClinicId,
  register,
}: {
  selectedClinicId: number;
  register: UseFormRegister<{
    clinicIds: number[];
  }>;
}) => {
  const clinicLists = useReactiveVar(clinicListsVar);

  return (
    <div className="flex flex-wrap gap-6 border-b px-6 py-2">
      {clinicLists.map((clinic) => (
        <Checkbox
          key={clinic.id}
          id={`search__clinic-${clinic.id}`}
          label={renameUseSplit(clinic.name)}
          type="checkbox"
          value={clinic.id}
          register={register('clinicIds', {
            required: true,
          })}
          defaultChecked={clinic.id === selectedClinicId}
        />
      ))}
    </div>
  );
};
