import { SERVICE_NAME } from '../constants/constants';
import { cls } from '../utils/commonUtils';

interface LogoProps {
  size?: 'xl' | '4xl' | 'xs';
  isVertical?: boolean;
}

export default function Logo(props: LogoProps) {
  const { size = 'xl', isVertical } = props;

  const [PHYSIO, DESK] = SERVICE_NAME.en.split(' ');

  return (
    <div
      className={cls(
        size === 'xl' ? 'text-xl' : '',
        size === '4xl' ? 'text-4xl' : '',
        size === 'xs' ? 'text-xs' : '',
        isVertical ? 'flex flex-col' : ''
      )}
    >
      <span className="font-bold">{PHYSIO}</span>
      <span className="font-extralight">{DESK}</span>
    </div>
  );
}
