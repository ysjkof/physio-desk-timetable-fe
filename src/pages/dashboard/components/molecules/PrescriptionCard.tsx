import { client } from '../../../../apollo';
import {
  FindPrescriptionsDocument,
  FindPrescriptionsQuery,
  useEditPrescriptionMutation,
} from '../../../../graphql/generated/graphql';
import { changeValueInArray, cls } from '../../../../utils/utils';

interface PrescriptionStateProps extends Pick<CardProps, 'clinicId'> {
  id: number;
  activate: boolean;
}

function PrescriptionState({ id, activate, clinicId }: PrescriptionStateProps) {
  const [callMutation] = useEditPrescriptionMutation();

  const toggleActivation = () => {
    const todo = activate ? '비활성' : '활성';
    if (!confirm(`처방을 ${todo} 하시겠습니까?`)) return;

    const inputActivate = !activate;

    callMutation({
      variables: {
        input: {
          id,
          activate: inputActivate,
        },
      },
      onCompleted(data) {
        const { ok } = data.editPrescription;
        ok;

        client.cache.updateQuery<FindPrescriptionsQuery>(
          {
            query: FindPrescriptionsDocument,
            variables: {
              input: {
                clinicId,
                onlyLookUpActive: false,
              },
            },
          },
          (cacheData) => {
            if (
              !cacheData ||
              !cacheData.findPrescriptions ||
              !cacheData.findPrescriptions.prescriptions
            )
              return cacheData;

            const index = cacheData.findPrescriptions.prescriptions.findIndex(
              (prescription) => prescription.id === id
            );
            if (index === -1) return cacheData;
            const changePrescription = {
              ...cacheData.findPrescriptions.prescriptions[index],
              activate: inputActivate,
            };

            return {
              ...cacheData,
              findPrescriptions: {
                ...cacheData.findPrescriptions,
                prescriptions: changeValueInArray(
                  cacheData.findPrescriptions.prescriptions,
                  changePrescription,
                  index
                ),
              },
            };
          }
        );
      },
    });
  };

  return (
    <button
      type="button"
      className={cls(
        'whitespace-nowrap rounded-full',
        activate ? 'badge-green' : 'badge-gray line-through'
      )}
      onClick={toggleActivation}
    >
      활성
    </button>
  );
}

interface CardProps {
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

  return (
    <div
      className={cls(
        'flex w-80 flex-col justify-between rounded-md border py-1',
        !activate ? 'font-light text-gray-500' : 'font-medium'
      )}
    >
      <div className="relative flex flex-col justify-center px-6">
        <div className="mb-1 flex items-center gap-4">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
            {name}
          </span>
          <div className="flex gap-2">
            {prescriptionAtoms?.map((atom) => (
              <span
                key={atom.id}
                className={cls('py-0', activate ? 'badge-green' : 'badge-gray')}
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
    </div>
  );
}
