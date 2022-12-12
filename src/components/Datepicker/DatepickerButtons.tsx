import { useContext } from 'react';
import MenuButton from '../MenuButton';
import { DatepickerContext } from './DatepickerStore';

export const DatepickerButtons = () => {
  const { closeAction } = useContext(DatepickerContext);

  return (
    <div className="mt-2 flex justify-end gap-4">
      <MenuButton onClick={closeAction} className="bg-close-bg">
        닫기
      </MenuButton>
    </div>
  );
};
