import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMe } from '../../hooks/useMe';
import { clinicMenu, personalMenu, ROUTES } from '../../router/routes';
import Dropdown from './Dropdown';
import { logout } from '../../pages/auth/authServices';
import { useState } from 'react';
import Logo from '../atoms/Logo';
import Banner from '../molecules/Banner';

interface Notice {
  __typename?: 'Notice' | undefined;
  message: string;
  read: boolean;
}

export const LoggedInGlobalNavigationBar = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, getValues, setValue } = useForm();
  const { data: meData } = useMe();
  const [hasBanner, setHasBanner] = useState(true);
  const onSubmitSearch = () => {
    const { search } = getValues();
    const searchTrim = search.trim();
    setValue('search', searchTrim);
    navigate(`/search?name=${searchTrim}`);
  };
  const invokeLogout = () => {
    logout(() => navigate('/'));
  };
  const closeBanner = () => setHasBanner(false);

  return (
    <>
      {hasBanner && meData && !meData.me.verified && (
        <Banner close={closeBanner} />
      )}
      <header className="HEADER header" id="header">
        <div className="flex w-full items-center gap-10">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex w-full items-center justify-end gap-6">
          <form onSubmit={handleSubmit(onSubmitSearch)}>
            <input
              {...register('search', { required: true })}
              type={'search'}
              placeholder="Search..."
              className="header-search w-28 rounded-md"
            />
          </form>
          <Link to={ROUTES.docs}>
            <span className="whitespace-nowrap">문서</span>
          </Link>
          <Link to="/tt">
            <span className="whitespace-nowrap  ">시간표</span>
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
                <Dropdown.Button onClick={invokeLogout}>
                  로그아웃
                </Dropdown.Button>
              </Dropdown.Ul>
            </Dropdown.Container>
          </Dropdown>
        </div>
      </header>
    </>
  );
};
