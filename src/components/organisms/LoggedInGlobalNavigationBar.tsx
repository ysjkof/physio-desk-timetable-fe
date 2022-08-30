import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMe } from '../../hooks/useMe';
import { ROUTES } from '../../router/routes';
import Dropdown from './Dropdown';
import { logout } from '../../pages/auth/authServices';

interface Notice {
  __typename?: 'Notice' | undefined;
  message: string;
  read: boolean;
}

export const LoggedInGlobalNavigationBar = () => {
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
      {meData && !meData.me.verified && (
        <div className="bg-red-500 p-3 text-center">
          <span className="text-base font-bold text-white">
            EMAIL 인증을 하면 모든 기능을 사용할 수 있습니다
          </span>
        </div>
      )}
      <header className="HEADER header" id="header">
        <div className="flex w-full items-center gap-10">
          <Link to="/">
            {/* <img src={muoolLogo} className="w-36" alt="Muool" /> */}
            <span className="header-title">Muool</span>
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
          <Link to="/tt">
            <span className="whitespace-nowrap  ">시간표</span>
          </Link>
          <Dropdown title={meData?.me.name}>
            <Dropdown.Container width={'12rem'}>
              <Dropdown.Ul>
                <Dropdown.Li to={ROUTES.editProfile}>프로필</Dropdown.Li>
                <Dropdown.Li to={ROUTES.dashboard}>대시보드</Dropdown.Li>
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
