import { cls } from '../utils/utils';

interface SwitchProps {
  enabled: boolean;
  label: string;
  onClick: any;
}

// FC = Functional Component
export default function Switch({ enabled, label, onClick }: SwitchProps) {
  return (
    <div className="flex cursor-pointer items-center" onClick={onClick}>
      <span className={cls(enabled ? '' : '', 'mr-0.5 hover:font-bold')}>
        {label}
      </span>
      <div
        className={cls(
          enabled ? 'bg-blue-500' : 'bg-white',
          'relative inline-flex h-[16px] w-[24px] flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent border-blue-500 transition-colors duration-200 ease-in-out  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
        )}
      >
        <span
          aria-hidden="true"
          className={cls(
            enabled ? 'translate-x-2' : 'translate-x-0 bg-blue-500',
            'pointer-events-none ml-[1px] inline-block h-[10px] w-[10px] transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out '
          )}
        />
      </div>
    </div>
  );
}
