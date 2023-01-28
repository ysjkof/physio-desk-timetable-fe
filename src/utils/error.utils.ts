import { toastVar } from '../store';

export function printNetworkError(message: string, route?: string) {
  const setMessage = (errMessage: string) => {
    const returnMessage = [
      '요청을 실패했습니다. 서버가 정지했을 수 있습니다.',
      '문제가 계속되면 고객센터에 문의하세요',
      errMessage || '',
    ];
    if (route) returnMessage.push(`문제가 발생한 곳 : ${route}`);
    return returnMessage;
  };
  toastVar({ messages: setMessage(message) });
}
