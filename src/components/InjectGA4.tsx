import { isProduction } from '../constants/constants';

const InjectGA4 = (trackingId: string) => {
  if (!isProduction) return;

  const head = document.getElementsByTagName('head');
  const asyncScript = document.createElement('script');
  const script = document.createElement('script');

  asyncScript.async = true;
  asyncScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;

  script.textContent = `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  gtag('config', '${trackingId}');`;

  head.item(0)?.appendChild(asyncScript);
  head.item(0)?.appendChild(script);
};

export default InjectGA4;
