import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toggleSettingOfTimetable, useStore } from '../../../../store';
import { getPositionRef } from '../../../../utils/common.utils';
import { EllipsisVertical } from '../../../../svgs';
import TableOptionSelector from '../../_legacy_components/TableOptionSelector';
import { MenuButton, Modal } from '../../../../components';

const DisplayControlButton = () => {
  const hasSettingOfTimetable = useStore(
    (state) => state.hasSettingOfTimetable
  );
  const settingRef = useRef<HTMLButtonElement>(null);

  const { top } = getPositionRef(settingRef);

  return (
    <>
      <MenuButton
        onClick={() => toggleSettingOfTimetable()}
        ref={settingRef}
        className="bg-deep-blue text-white"
      >
        <EllipsisVertical />
        설정
      </MenuButton>

      <AnimatePresence>
        {hasSettingOfTimetable && (
          <Modal
            top={top}
            right={10}
            closeAction={() => toggleSettingOfTimetable(false)}
          >
            <TableOptionSelector />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default DisplayControlButton;
