import { Dispatch, useState } from 'react';
import { sortByBoolean, sortByString } from '../../../../utils/commonUtils';
import { VerticalCrossArrow } from '../../../../svgs';
import type { MemberOfGetMyClinic } from '../../../../types/processedGeneratedTypes';

interface AlignmentButtonsProps {
  setMembers: Dispatch<React.SetStateAction<MemberOfGetMyClinic>>;
}

const AlignmentButtons = ({ setMembers }: AlignmentButtonsProps) => {
  const [sortingCriteria, setSortingCriteria] = useState({
    letter: false,
    waitingForApproval: false,
  });

  const sortByLetter = () => {
    if (!sortingCriteria.letter) sortAscByLetter();
    else sortDescByLetter();
    setSortingCriteria((prev) => ({ ...prev, letter: !prev.letter }));
  };

  const sortAscByLetter = () => {
    setMembers((prev) => {
      const updated = [...prev];
      return updated.sort((a, b) =>
        sortByString(a.user.name, b.user.name, 'ASC')
      );
    });
  };

  const sortDescByLetter = () => {
    setMembers((prev) => [
      ...prev.sort((a, b) => sortByString(a.user.name, b.user.name, 'DESC')),
    ]);
  };

  const sortByWaitingForApproval = () => {
    if (!sortingCriteria.waitingForApproval) sortAscByWaitingForApproval();
    else sortDescByWaitingForApproval();
    setSortingCriteria((prev) => ({
      ...prev,
      waitingForApproval: !prev.waitingForApproval,
    }));
  };

  const sortAscByWaitingForApproval = () => {
    setMembers((prev) => {
      const updated = [...prev];
      return updated.sort((a, b) =>
        sortByBoolean(a.accepted, b.accepted, 'ASC')
      );
    });
  };

  const sortDescByWaitingForApproval = () => {
    setMembers((prev) => {
      const updated = [...prev];
      return updated.sort((a, b) =>
        sortByBoolean(a.accepted, b.accepted, 'DESC')
      );
    });
  };
  return (
    <div className="flex gap-8 border-y py-2 px-4 text-xs">
      <button
        type="button"
        className="flex gap-1"
        onClick={sortByWaitingForApproval}
      >
        <VerticalCrossArrow /> 수락대기
      </button>
      <button type="button" className="flex gap-1" onClick={sortByLetter}>
        <VerticalCrossArrow /> 가나다
      </button>
    </div>
  );
};

export default AlignmentButtons;
