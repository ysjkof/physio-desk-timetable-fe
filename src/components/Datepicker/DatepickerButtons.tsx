import MenuButton from '../MenuButton';

export const DatepickerButtons = () => {
  return (
    <div className="mt-2 flex justify-end gap-4">
      <MenuButton backgroundColor="#C9C9C9" color="white" onClick={() => {}}>
        취소
      </MenuButton>
      <MenuButton backgroundColor="#6BA6FF" color="white" onClick={() => {}}>
        선택
      </MenuButton>
    </div>
  );
};
