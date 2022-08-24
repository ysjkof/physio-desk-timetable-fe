import { useMeQuery } from '../graphql/generated/graphql';
import { logout } from '../pages/auth/authServices';

// apollo는 캐시를 먼저 탐색하고 없다면 백엔드에 요청한다. useMe가 여러곳에서 호출되더라도 캐시에 있다면 자동으로 재사용하고 백엔드를 거치지 않는다.
export const useMe = () => {
  return useMeQuery({
    onError(error) {
      if (error) {
        const {
          clientErrors,
          extraInfo,
          message,
          name,
          networkError,
          cause,
          graphQLErrors,
          stack,
        } = error;

        console.warn(
          `
    useMe에서 에러 발생
    clientErrors : ${clientErrors}
    extraInfo : ${extraInfo}
    message : ${message}
    name : ${name}
    networkError : ${networkError}
    cause : ${cause}
    graphQLErrors :`,
          graphQLErrors
        );
        console.warn('    stack :', stack);
        logout();
      }
    },
  });
};
