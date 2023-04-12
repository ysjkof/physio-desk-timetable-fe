import { LOCALE } from '../../../../constants/constants';
import type { PickedPrescription } from '../../../../types/commonTypes';

interface PrescriptionTotalProps {
  selectedPrescription: PickedPrescription;
}

export const PrescriptionTotal = ({
  selectedPrescription,
}: PrescriptionTotalProps) => {
  const totalPrice = selectedPrescription.price.toLocaleString(LOCALE);
  const totalTime = selectedPrescription.minute;

  if (selectedPrescription.prescriptions.length === 0) return null;

  return (
    <div className="absolute flex w-full pt-1 text-xs">
      <span className="w-full">총가격 : {totalPrice}원</span>
      <span className="w-full">치료시간 : {totalTime}분</span>
    </div>
  );
};
