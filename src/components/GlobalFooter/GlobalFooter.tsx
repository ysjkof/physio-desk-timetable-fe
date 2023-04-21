import { type PropsWithChildren } from 'react';
import {
  COMPANY_NAME,
  CONTACT_EMAIL,
  OWNER_NAME,
  PRODUCT_NAME,
} from '../../constants/constants';
import { Link } from 'react-router-dom';
import { PRIVACY_POLICY, TERM_AND_CONDITIONS } from '../../router/routes';

const GlobalFooter = () => {
  return (
    <footer className="border-t border-[#D9D9D9] bg-[#F8F8F8] pb-16 pt-10">
      <div className="mx-auto flex flex-wrap gap-x-32 gap-y-12 px-4 md:max-w-4xl">
        <div>
          <ColumnTitle>{PRODUCT_NAME}</ColumnTitle>
          <p className="text-xs">
            회사 : {COMPANY_NAME}
            <br />
            대표 : {OWNER_NAME}
            <br />
            개인정보관리책임자 : {OWNER_NAME}
            <br />
            이메일 :
            <a href={`mailto:${CONTACT_EMAIL}`} className="ml-1">
              {CONTACT_EMAIL}
            </a>
            <br />
            인스타그램 :
            <a
              href="https://www.instagram.com/muool.owner"
              className="ml-1"
              target="_blank"
            >
              {CONTACT_EMAIL.split('@')[0]}
            </a>
          </p>
        </div>
        <div>
          <ColumnTitle>기타</ColumnTitle>
          <ul className="text-xs">
            <li>
              <Link to={TERM_AND_CONDITIONS}>서비스 이용약관</Link>
            </li>
            <br />
            <li>
              <Link to={PRIVACY_POLICY}>개인정보처리방침</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;

const ColumnTitle = (props: PropsWithChildren) => (
  <h4 className="mb-4 text-sm font-bold">{props.children}</h4>
);
