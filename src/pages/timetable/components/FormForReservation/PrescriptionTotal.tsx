import type { SelectedPrescription } from '../../../../types/common.types';

interface PrescriptionTotalProps {
  selectedPrescription: SelectedPrescription;
}

export const PrescriptionTotal = ({
  selectedPrescription,
}: PrescriptionTotalProps) => {
  return (
    <div className="absolute flex w-full pt-1 text-xs">
      <span className="w-full">
        총가격 : {selectedPrescription.price.toLocaleString('ko-kr')}원
      </span>
      <span className="w-full">치료시간 : {selectedPrescription.minute}분</span>
    </div>
  );
};
