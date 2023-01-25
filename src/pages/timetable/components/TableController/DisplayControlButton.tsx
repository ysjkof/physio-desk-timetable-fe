import { useRef } from 'react';
import { useReactiveVar } from '@apollo/client';
import { AnimatePresence } from 'framer-motion';
import { hasTableDisplayVar } from '../../../../store';
import { getPositionRef } from '../../../../utils/common.utils';
import { EllipsisVertical } from '../../../../svgs';
import TableOptionSelector from '../../_legacy_components/TableOptionSelector';
import { MenuButton, Modal } from '../../../../components';
import { useTableDisplay } from '../../hooks';

const DisplayControlButton = () => {
  const hasTableDisplay = useReactiveVar(hasTableDisplayVar);

  const settingRef = useRef<HTMLButtonElement>(null);

  const { toggleDisplayController } = useTableDisplay();

  const { top } = getPositionRef(settingRef);

  return (
    <>
      <MenuButton
        onClick={() => toggleDisplayController()}
        ref={settingRef}
        className="bg-deep-blue text-white"
      >
        <EllipsisVertical />
        설정
      </MenuButton>

      <AnimatePresence>
        {hasTableDisplay && (
          <Modal
            top={top}
            right={10}
            closeAction={() => toggleDisplayController(false)}
          >
            <TableOptionSelector />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default DisplayControlButton;
