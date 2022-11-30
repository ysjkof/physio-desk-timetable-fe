import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../router/routes';
import { cls } from '../../../../utils/common.utils';
import { CogSixTooth, Building, Table } from '../../../../svgs';
import TableClinicSelector from './TableClinicSelector';

function TableAside() {
  return (
    <aside
      id="timetable__aside-nav"
      className="flex h-full w-44 flex-col justify-between bg-table-aside-bg py-4 text-white"
    >
      <div className="mb-6 flex flex-col items-center justify-center gap-2 px-4">
        <Link to="/">
          <Logo />
        </Link>
        <TableClinicSelector />
      </div>

      <Ul>
        <Li to={ROUTES.timetable} selected>
          <Table /> 시간표
        </Li>
        <Li to={ROUTES.clinics}>
          <Building /> 병원
        </Li>
        <Li to={ROUTES.edit_profile}>
          <CogSixTooth /> 프로필
        </Li>
      </Ul>

      <div className="flex flex-col gap-2 text-xs text-gray-400">
        <button type="button">로그아웃</button>
        <button type="button">문의하기</button>
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <h1 className="cursor-pointer whitespace-nowrap text-xl font-bold">
      MUOOL
    </h1>
  );
}
export interface UlProps extends PropsWithChildren {}
function Ul({ children }: UlProps) {
  return (
    <div className={cls('flex h-full flex-col')}>
      <ul>{children}</ul>
    </div>
  );
}

interface LiProps extends PropsWithChildren {
  to: string;
  selected?: boolean;
}
function Li({ to, children, selected }: LiProps) {
  return (
    <li
      className={cls(
        'relative w-full cursor-pointer list-none whitespace-nowrap text-xs',
        selected
          ? 'bg-[#7477B2] font-medium text-white'
          : 'text-gray-500 hover:text-white'
      )}
    >
      <Link
        to={to}
        className="flex h-full w-full items-center gap-1 py-1.5 px-4 text-left"
      >
        {children}
      </Link>
    </li>
  );
}

export default TableAside;
