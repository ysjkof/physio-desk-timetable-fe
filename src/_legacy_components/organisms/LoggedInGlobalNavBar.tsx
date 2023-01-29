import { useState } from 'react';
import { useMe } from '../../hooks';
import Banner from '../molecules/Banner';
import GlobalNavBarLayout from '../../components/GlobalNavBar/GlobalNavBarLayout';
import LoggedInGlobalNavBarMenu from '../molecules/LoggedInGlobalNavBarMenu';

export default function LoggedInGlobalNavBar() {
  const { data: meData } = useMe();
  const [hasBanner, setHasBanner] = useState(true);
  const closeBanner = () => setHasBanner(false);

  return (
    <>
      {hasBanner && meData && !meData.me.verified && (
        <Banner close={closeBanner} />
      )}
      <GlobalNavBarLayout>
        <LoggedInGlobalNavBarMenu />
      </GlobalNavBarLayout>
    </>
  );
}
