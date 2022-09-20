import { FindPrescriptionsQuery } from '../../../../graphql/generated/graphql';
import { cls } from '../../../../utils/utils';

interface CardProps {
  prescription: NonNullable<
    FlatArray<FindPrescriptionsQuery['findPrescriptions']['prescriptions'], 1>
  >;
}

export default function PrescriptionCard({ prescription }: CardProps) {
  const {
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
          <span
            className={cls(
              'whitespace-nowrap rounded-full',
              activate ? 'badge-green' : 'badge-gray'
            )}
          >
            활성
          </span>
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
