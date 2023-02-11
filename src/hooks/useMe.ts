import { OperationVariables, QueryResult, useQuery } from '@apollo/client';
import { ME_DOCUMENT } from '../graphql';
import { useLogout } from './useLogout';
import type { MeQuery } from '../types/generated.types';

export const useMe = (): [
  MeQuery['me'] | undefined,
  QueryResult<MeQuery, OperationVariables>
] => {
  const logout = useLogout();

  const results = useQuery<MeQuery>(ME_DOCUMENT, {
    onError(error) {
      console.info('Error on useMe : ', error);
      logout();
    },
  });

  return [results.data?.me, results];
};
