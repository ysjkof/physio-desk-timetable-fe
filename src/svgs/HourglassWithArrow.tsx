import { SVG } from '../types/common.types';
import { cls } from '../utils/common.utils';

/**
 * by JH
 */
const HourglassWithArrow = ({ iconSize = 'MD', ...args }: SVG) => {
  return (
    <svg
      width="68"
      height="64"
      viewBox="0 0 68 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#F0817A"
      strokeWidth={2}
      {...args}
      className={cls(
        args.className || '',
        iconSize === 'LG' ? 'h-20 w-20' : '',
        iconSize === 'MD' ? 'h-18 w-18' : '',
        iconSize === 'SM' ? 'h-6 w-6' : ''
      )}
    >
      <path
        d="M5.15913 32.4906C4.94919 15.5187 18.5375 1.59007 35.5094 1.38013C52.4813 1.17019 66.4099 14.7585 66.6199 31.7304C66.7199 39.8178 63.6868 47.2142 58.6474 52.7645C53.1113 58.8617 45.1541 62.731 36.2696 62.8409"
        strokeLinecap="round"
      />
      <path
        d="M8.69995 30.6655L5.32074 34.1294C5.24361 34.2084 5.11699 34.21 5.03792 34.1329L1.57407 30.7537"
        strokeLinecap="round"
      />
      <path d="M22 13.3203L50 13.3203" strokeLinecap="round" />
      <path d="M22 52.52L50 52.52" strokeLinecap="round" />
      <path
        d="M24.8003 13.3203L26.2003 24.5203L30.4003 31.5203L26.2003 38.5203L24.8003 51.1203H47.2003L45.8003 38.5203L41.6003 31.5203L45.8003 24.5203L47.2003 13.3203H24.8003Z"
        strokeLinejoin="round"
      />
      <path d="M31.0558 47.2607H40.9446C42.013 47.2607 42.7388 46.1756 42.3311 45.1882L39.052 37.2478C38.8202 36.6865 38.2728 36.3203 37.6655 36.3203H34.3345C33.7272 36.3203 33.1798 36.6865 32.948 37.2478L29.6693 45.1883C29.2616 46.1757 29.9874 47.2607 31.0558 47.2607Z" />
      <path
        d="M34.2433 26.3203L31.5008 22.0924C31.285 21.7598 31.5238 21.3203 31.9203 21.3203L40.0797 21.3203C40.4762 21.3203 40.715 21.7597 40.4992 22.0924L37.7571 26.3203L37.1014 27.1864C37.0356 27.2733 37 27.3793 37 27.4882L37 29.3203"
        strokeLinecap="round"
      />
      <path d="M37 28.3203V29.3203" strokeLinecap="round" />
    </svg>
  );
};

export default HourglassWithArrow;
