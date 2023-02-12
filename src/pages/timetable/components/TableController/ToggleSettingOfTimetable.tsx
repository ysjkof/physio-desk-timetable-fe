import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toggleSettingOfTimetable, useStore } from '../../../../store';
import { getPositionRef } from '../../../../utils/common.utils';
import { EllipsisVertical } from '../../../../svgs';
import SettingOfTimetable from '../SettingOfTimetable/SettingOfTimetable';
import { MenuButton, Modal } from '../../../../components';

const ToggleSettingOfTimetable = () => {
  const showSettingOfTimetable = useStore(
    (state) => state.showSettingOfTimetable
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
        {showSettingOfTimetable && (
          <Modal
            top={top}
            right={10}
            closeAction={() => toggleSettingOfTimetable(false)}
          >
            <SettingOfTimetable />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ToggleSettingOfTimetable;
