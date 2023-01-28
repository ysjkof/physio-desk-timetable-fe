import { useContext } from 'react';
import MenuButton from '../MenuButton';
import { TimepickerContext } from './TimepickerStore';

export const TimepickerButtons = () => {
  const { closeAction } = useContext(TimepickerContext);

  return (
    <div className="mt-2 flex justify-center gap-4 border-t">
      <MenuButton hasBorder onClick={closeAction}>
        닫기
      </MenuButton>
    </div>
  );
};
