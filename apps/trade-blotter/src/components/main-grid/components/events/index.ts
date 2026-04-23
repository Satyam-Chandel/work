import { SfSpinner, SfTabs } from '@sfcm/framework';
import { Context } from 'components/trade-blotter/context';
import { useContext } from 'react';
import Activities from './components/activities';
import Settlements from './components/settlement';

const Events = (): JSX.Element => {
  const { data } = useContext(Context);

  return (
    <>
      <SfTabs
        id='tabs-tb-events'
        defaultTabKey='activities'
        tabList={[
          { key: 'activities', text: 'Activities', component: <Activities /> },
          { key: 'settlements', text: 'Settlements', component: <Settlements /> },
        ]}
      />
      <SfSpinner id='spinner-tb-events' show={data.IsEventsBusy} />
    </>
  );
};

export default Events;
