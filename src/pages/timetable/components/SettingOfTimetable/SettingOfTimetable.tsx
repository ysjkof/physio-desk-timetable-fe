import { motion, Variants } from 'framer-motion';
import { Header } from './Header';
import { TimeDurationSelector } from './TimeDurationSelector';
import { ToggleShowButtons } from './ToggleShowButtons';
import { ClinicAndUserSelector } from './ClinicAndUserSelector';

function SettingOfTimetable() {
  const variants: Variants = {
    init: { x: 300 },
    end: { x: 0, transition: { duration: 0.3 } },
    exit: { x: 300, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={variants}
      initial="init"
      animate="end"
      exit="exit"
      id="table-option-selector"
      className="w-[240px] rounded-md border border-gray-400 bg-white py-2 shadow-cst"
    >
      <Header />
      <TimeDurationSelector />
      <ToggleShowButtons />
      <ClinicAndUserSelector />
    </motion.div>
  );
}

export default SettingOfTimetable;
