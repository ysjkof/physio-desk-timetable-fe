import type { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../router/routes';
import { cls } from '../../../../utils/common.utils';
import { CogSixTooth, Building, Table } from '../../../../svgs';
import TableClinicSelector from './TableClinicSelector';
import { useTableDisplay } from '../../hooks';

interface LiProps extends PropsWithChildren {
  to: string;
  selected?: boolean;
}

const TableAside = () => {
  const {
    tableDisplay: { asideExtension: extendedAside },
    toggleDisplayOption,
  } = useTableDisplay();

  const toggleAsideExtension = () => {
    toggleDisplayOption('asideExtension');
  };

  return (
    <aside
      id="timetable__aside-nav"
      className="flex h-full w-full flex-col justify-between bg-table-aside-bg py-4 text-white"
    >
      <div className="relative mb-6 flex h-28 flex-col items-center justify-center gap-2 px-4">
        {extendedAside && (
          <>
            <Link to="/">
              <Logo />
            </Link>
            <TableClinicSelector />
          </>
        )}
      </div>
      <button
        type="button"
        onClick={toggleAsideExtension}
        className="mx-auto mb-4 w-fit rounded-sm border px-2 py-0.5"
      >
        {extendedAside ? '작게' : '크게'}
      </button>

      <Ul>
        <Li to={ROUTES.timetable} selected>
          <Table />
          {extendedAside && '시간표'}
        </Li>
        <Li to={ROUTES.clinics}>
          <Building />
          {extendedAside && '병원'}
        </Li>
        <Li to={ROUTES.editProfile}>
          <CogSixTooth />
          {extendedAside && '프로필'}
        </Li>
      </Ul>

      <div className="flex flex-col gap-2 text-xs text-gray-400">
        <button type="button">로그아웃</button>
        <button type="button">문의하기</button>
      </div>
    </aside>
  );
};

const Logo = () => {
  return (
    <h1 className="cursor-pointer whitespace-nowrap text-xl font-bold">
      MUOOL
    </h1>
  );
};

const Ul = ({ children }: PropsWithChildren) => {
  return (
    <div className={cls('flex h-full flex-col')}>
      <ul>{children}</ul>
    </div>
  );
};

const Li = ({ to, children, selected }: LiProps) => {
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
};

export default TableAside;
