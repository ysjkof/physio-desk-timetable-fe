import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMe } from '../../hooks/useMe';
import { clinicMenu, personalMenu, ROUTES } from '../../router/routes';
import Dropdown from './Dropdown';
import { logout } from '../../pages/auth/authServices';

export default function LoggedInGlobalNavBarMenu() {
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, setValue } = useForm();
  const { data: meData } = useMe();
  const onSubmitSearch = () => {
    const { search } = getValues();
    const searchTrim = search.trim();
    setValue('search', searchTrim);
    navigate(`/search?name=${searchTrim}`);
  };
  const invokeLogout = () => {
    logout(() => navigate('/'));
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmitSearch)}>
        <input
          {...register('search', { required: true })}
          type="search"
          placeholder="검색"
          className="w-20 appearance-none rounded-md border border-gray-300 px-2 py-0.5 font-light placeholder-gray-400 shadow-sm transition-colors placeholder:text-center focus:border-green-500 focus:outline-none sm:w-28 sm:px-3 sm:py-1"
        />
      </form>
      <Link to={ROUTES.docs}>
        <span className="whitespace-nowrap">문서</span>
      </Link>
      <Link to={ROUTES.timetable}>
        <span className="whitespace-nowrap">시간표</span>
      </Link>
      <Dropdown title={meData?.me.name}>
        <Dropdown.Container width={'12rem'}>
          <Dropdown.Ul>
            {clinicMenu.map((menu, idx) => (
              <Dropdown.Li key={idx} to={ROUTES[menu.route]}>
                {menu.name}
              </Dropdown.Li>
            ))}
          </Dropdown.Ul>
          <Dropdown.Ul>
            {personalMenu.map((menu, idx) => (
              <Dropdown.Li key={idx} to={ROUTES[menu.route]}>
                {menu.name}
              </Dropdown.Li>
            ))}
          </Dropdown.Ul>
          <Dropdown.Ul>
            <Dropdown.Button onClick={invokeLogout}>로그아웃</Dropdown.Button>
          </Dropdown.Ul>
        </Dropdown.Container>
      </Dropdown>
    </>
  );
}
