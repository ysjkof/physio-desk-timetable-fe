import { useMe } from '../../hooks/useMe';
import { useState } from 'react';
import Banner from '../molecules/Banner';
import { GlobalNavigationBarLayout } from '../molecules/GlobalNavigationBarLayout';
import { LoggedInGlobalNavBarMenu } from '../molecules/LoggedInGlobalNavBarMenu';

export const LoggedInGlobalNavBar = () => {
  const { data: meData } = useMe();
  const [hasBanner, setHasBanner] = useState(true);
  const closeBanner = () => setHasBanner(false);

  return (
    <>
      {hasBanner && meData && !meData.me.verified && (
        <Banner close={closeBanner} />
      )}
      <GlobalNavigationBarLayout>
        <LoggedInGlobalNavBarMenu />
      </GlobalNavigationBarLayout>
    </>
  );
};
