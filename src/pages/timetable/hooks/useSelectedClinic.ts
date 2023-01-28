import { ClinicsOfClient } from '../../../models';
import { clinicListsVar } from '../../../store';

export const useSelectedClinic = () => {
  const selectClinic = (id: number) => {
    if (ClinicsOfClient.selectedClinic?.id === id) return;

    const clinic = ClinicsOfClient.getById(id);

    if (!clinic)
      throw new Error('', {
        cause: 'clinics of client에서 clinic을 찾지 못했습니다.',
      });
    ClinicsOfClient.selectClinic(id);

    const clinicList = ClinicsOfClient.get();

    ClinicsOfClient.saveToLocalStorage(clinicList);

    clinicListsVar(clinicList);
  };

  const toggleUser = (memberId: number) => {
    const toggledClinic = ClinicsOfClient.toggleUserCanSee(memberId);
    if (!toggledClinic) return;

    ClinicsOfClient.saveToLocalStorage(toggledClinic);
    ClinicsOfClient.set(toggledClinic);
    clinicListsVar([...toggledClinic]);
  };

  return { selectClinic, toggleUser };
};
