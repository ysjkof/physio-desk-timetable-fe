import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import { cls } from '../../../../utils/commonUtils';
import { ToggleShowButtons } from './ToggleShowButtons';
import { TimeDurationSelector } from './TimeDurationSelector';

function SettingOfTimetable() {
  const variants: Variants = {
    init: { x: 300 },
    end: { x: 0, transition: { duration: 0.3 } },
    exit: { x: 300, transition: { duration: 0.3 } },
  };

  const [isShow, setIsShow] = useState<'time' | 'view'>('view');

  const showTime = () => setIsShow('time');
  const showView = () => setIsShow('view');

  return (
    <div className="flex">
      <motion.div
        variants={variants}
        initial="init"
        animate="end"
        exit="exit"
        className="flex w-[240px] flex-col divide-y rounded-md border border-gray-400 bg-white shadow-cst"
      >
        <div className="flex">
          <Btn
            enabled={isShow === 'time'}
            label="시간설정"
            onClick={showTime}
          />
          <Btn
            enabled={isShow === 'view'}
            label="보기설정"
            onClick={showView}
          />
        </div>
        {isShow === 'time' && <TimeDurationSelector />}
        {isShow === 'view' && <ToggleShowButtons />}
      </motion.div>
    </div>
  );
}

interface BtnProps {
  enabled: boolean;
  label: string;
  onClick: () => void;
}

const Btn = ({ enabled, label, onClick }: BtnProps) => {
  return (
    <button
      type="button"
      className={cls(
        'w-full py-2 text-center text-lg font-medium hover:bg-[#6889BB] hover:text-white',
        enabled ? 'bg-[#6889BB] font-bold text-white' : ''
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SettingOfTimetable;
