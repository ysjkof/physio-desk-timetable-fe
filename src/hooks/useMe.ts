import { OperationVariables, QueryResult, useQuery } from '@apollo/client';
import { ME_DOCUMENT } from '../graphql';
import { useLogout } from './useLogout';
import type { MeQuery } from '../types/generated.types';

interface CustomFx {
  getIdName: () => { userId: number; userName: string };
}

export const useMe = (): [
  MeQuery['me'] | undefined,
  QueryResult<MeQuery, OperationVariables> & CustomFx
] => {
  const logout = useLogout();

  const results = useQuery<MeQuery>(ME_DOCUMENT, {
    onError(error) {
      console.info('Error on useMe : ', error);
      logout();
    },
  });

  const getIdName = () => {
    if (!results.data) throw new Error('useMe에서 getIdName할 때 에러');

    return {
      userId: results.data.me.id,
      userName: results.data.me.name,
    };
  };

  return [results.data?.me, { ...results, getIdName }];
};
