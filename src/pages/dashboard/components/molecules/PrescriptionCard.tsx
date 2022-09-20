import { useState } from 'react';
import Button from '../../../../components/molecules/Button';
import { FindPrescriptionsQuery } from '../../../../graphql/generated/graphql';
import Edit from '../../../../svgs/Edit';
import { cls } from '../../../../utils/utils';
import PrescriptionEdit from './PrescriptionEdit';
import PrescriptionState from './PrescriptionState';

export interface CardProps {
  prescription: NonNullable<
    FlatArray<FindPrescriptionsQuery['findPrescriptions']['prescriptions'], 1>
  >;
  clinicId: number;
}

export default function PrescriptionCard({
  prescription,
  clinicId,
}: CardProps) {
  const {
    id,
    name,
    price,
    requiredTime,
    activate,
    description,
    prescriptionAtoms,
  } = prescription;

  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  return (
    <div
      className={cls(
        'relative flex w-80 flex-col justify-between rounded-md border py-1',
        !activate ? 'font-light text-gray-500' : 'font-medium'
      )}
    >
      {isEditMode ? (
        <>
          <PrescriptionEdit prescription={prescription} clinicId={clinicId} />
          <Button
            className="absolute right-6 top-1.5 py-0.5"
            isSmall
            canClick
            loading={false}
            onClick={toggleEditMode}
          >
            취소
          </Button>
        </>
      ) : (
        <div className="relative flex flex-col justify-center px-6">
          <div className="mb-1 flex items-center gap-4">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
              {name}
            </span>
            <div className="flex flex-wrap gap-2">
              {prescriptionAtoms?.map((atom) => (
                <span
                  key={atom.id}
                  className={cls(
                    'py-0',
                    activate ? 'badge-green' : 'badge-gray'
                  )}
                >
                  {atom.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-1 flex items-center gap-2">
            <PrescriptionState
              id={id}
              activate={!!activate}
              clinicId={clinicId}
            />
            <span className="w-12 text-right">{requiredTime}분</span>
            <span className="w-20 text-right">{price}원</span>
            <button className="ml-auto" onClick={toggleEditMode}>
              <Edit />
            </button>
          </div>
          {description && (
            <details className="pt-2">
              <summary className="overflow-hidden text-ellipsis whitespace-nowrap">
                {description}
              </summary>
              {description}
            </details>
          )}
        </div>
      )}{' '}
    </div>
  );
}
