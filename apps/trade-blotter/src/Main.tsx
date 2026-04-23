import React from 'react';
import { registerAgGridLicense } from '@sfcm/grid';
import TradeBlotterModule from 'components/trade-blotter';

registerAgGridLicense();
const Main = (): JSX.Element => {
  return (
      <TradeBlotterModule />
  );
};

export default Main;