import { Link } from 'react-router-dom';
import { SelectedMenuType } from '..';
import { ISelectedClinic } from '../../../types/type';
import { cls } from '../../../utils/utils';

interface DashboardNavListProps {
  selectedMenu: SelectedMenuType;
  selectedClinic: ISelectedClinic;
  type: string;
  to: string;
}
export const DashboardNavList = ({
  selectedMenu,
  selectedClinic,
  type,
  to,
}: DashboardNavListProps) => {
  let textContents = '';
  let isManagerMenu = false;
  switch (type) {
    case 'main':
      textContents = '처음';
      break;
    case 'member':
      textContents = '구성원';
      break;
    case 'invite':
      textContents = '초대';
      isManagerMenu = true;
      break;
    case 'prescription':
      textContents = '처방관리';
      break;
    case 'statistics':
      textContents = '통계';
      break;
    case 'create':
      textContents = '병원 만들기';
      break;
    case 'clinics':
      textContents = '나의 병원';
      break;
  }

  return (
    <li
      className={cls(
        'btn-menu w-full cursor-pointer rounded-none',
        selectedMenu === type ? 'bg-green-100 font-semibold' : '',
        isManagerMenu && selectedClinic.isManager === false
          ? 'pointer-events-none opacity-50'
          : ''
      )}
    >
      <Link to={to} className="block w-full">
        {textContents}
      </Link>
    </li>
  );
};
