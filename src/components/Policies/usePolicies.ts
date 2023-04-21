import { useEffect, useState } from 'react';
import { setAlert } from '../../store';
import type { PoliciesType } from '../../types/commonTypes';
import {
  BACKEND_ORIGIN,
  PRIVACY_POLICY,
  SIGN_UP_AGREEMENTS,
  TERM_AND_CONDITIONS,
} from '../../router/routes';

export const usePolicies = (type: PoliciesType) => {
  const [html, setHtml] = useState('empty');

  const URL = {
    TERM_AND_CONDITIONS,
    SIGN_UP_AGREEMENTS,
    PRIVACY_POLICY,
  };

  useEffect(() => {
    fetch(`${BACKEND_ORIGIN}${URL[type]}`)
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
