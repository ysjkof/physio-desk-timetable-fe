import { useEffect, useState } from 'react';
import { setAlert } from '../../store';
import {
  개인정보_수집_이용_동의_URL,
  개인정보_처리방침_URL,
  서비스_이용약관_URL,
} from '../../constants/constants';

type PoliciesType =
  | '서비스_이용약관_URL'
  | '개인정보_수집_이용_동의_URL'
  | '개인정보_처리방침_URL';

export const usePolicies = (type: PoliciesType) => {
  const [html, setHtml] = useState('empty');

  const URL = {
    서비스_이용약관_URL,
    개인정보_수집_이용_동의_URL,
    개인정보_처리방침_URL,
  };

  useEffect(() => {
    fetch(URL[type])
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setHtml(result.html);
      })
      .catch((error) => {
        console.error(error);
        setAlert({
          messages: [`${type.split('_URL')[0]}을(를) 불러오는 중 에러 발생`],
        });
      });
  }, []);

  return html;
};
