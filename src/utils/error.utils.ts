import { setToast } from '../store';

export function printNetworkError(route?: string) {
  const messages: string[] = [
    '요청을 실패했습니다.',
    '이 문제는 브라우저 새로고침으로 해결될 수 있습니다.',
    '문제가 계속되면 고객센터에 문의하세요',
  ];

  if (route) messages.push(`문제가 발생한 곳 : ${route}`);

  setToast({ messages });
}

const GQL_ERROR = {
  gotInvalidValue: 'input에 잘못된 값을 받았습니다.',
} as const;

export function printGraphQLErrors(error: keyof typeof GQL_ERROR) {
  setToast({ messages: [GQL_ERROR[error]] });
}
