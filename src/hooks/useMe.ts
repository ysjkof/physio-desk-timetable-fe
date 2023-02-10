import { useQuery } from '@apollo/client';
import { ME_DOCUMENT } from '../graphql';
import type { MeQuery } from '../types/generated.types';
import { useLogout } from './useLogout';

// apollo는 캐시를 먼저 탐색하고 없다면 백엔드에 요청한다. useMe가 여러곳에서 호출되더라도 캐시에 있다면 자동으로 재사용하고 백엔드를 거치지 않는다.
export const useMe = () => {
  const logout = useLogout();

  return useQuery<MeQuery>(ME_DOCUMENT, {
    onError(error) {
      console.info('Error on useMe : ', error);
      logout();
    },
  });
};
