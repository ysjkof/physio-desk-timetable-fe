import { useNavigate } from 'react-router-dom';
import { useMeQuery } from '../graphql/generated/graphql';
import { logout } from '../pages/auth/authServices';
import localStorageUtils from '../utils/localStorageUtils';

// apollo는 캐시를 먼저 탐색하고 없다면 백엔드에 요청한다. useMe가 여러곳에서 호출되더라도 캐시에 있다면 자동으로 재사용하고 백엔드를 거치지 않는다.
export const useMe = () => {
  const navigation = useNavigate();
  const token = localStorageUtils.get<string>({ key: 'token' });
  if (!token) {
    console.info('토큰이 없습니다. 하려던 일은 useMe입니다');
  }
  return useMeQuery({
    onError(error) {
      console.info('Error on useMe');
      logout(() => navigation('/'));
    },
  });
};
