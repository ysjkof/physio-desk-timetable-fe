import { cls } from '../../utils/utils';

interface BtnMenuToggleProps {
  firstEnabled: boolean;
  secondEnabled: boolean;
  label: [string, string];
  width?: 'full';
  onClick: any;
}

export default function BtnMenuToggle({
  firstEnabled,
  secondEnabled,
  label,
  width,
  onClick,
}: BtnMenuToggleProps) {
  return (
    <button
      className={cls(
        'btn-menu whitespace-nowrap border-inherit',
        width ? 'w-full justify-around space-x-20' : 'space-x-2'
      )}
      onClick={onClick}
    >
      <span className={firstEnabled ? 'font-semibold' : 'opacity-50'}>
        {label[0]}
      </span>
      <span className={secondEnabled ? 'font-semibold' : 'opacity-50'}>
        {label[1]}
      </span>
    </button>
  );
}
