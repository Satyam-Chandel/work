import { SfButton, SfPage, SfSpinner } from '@sfcm/framework';
import { TradeEntryDrawer } from '@sfcm/modules';
import MainGrid from 'components/main-grid';
import Queries from 'components/main-grid/components/queries';
import useEnterSubmit from 'components/shared/hooks/useEnterSubmit';
import { TradeActionsManager } from 'components/trade-actions';
import { useContext, useState } from 'react';
import { ACTION_SUBMIT_TRADE, Context } from './../../context';

const MainLayout = (): JSX.Element => {
  const { data, callAction } = useContext(Context);

  const [isTradeEntryOpen, setTradeEntryOpen] = useState(false);

  useEnterSubmit({
    onFallbackSubmit: () => {
      if (isTradeEntryOpen) {
        callAction(ACTION_SUBMIT_TRADE, {});
      }
    },
  });

  return (
    <>
      <SfSpinner id='spinner-tb' show={data.IsBusy} />

      <SfPage
        id='page-trade-blotter'
        title='Trade Blotter'
        actions={
          <>
            <Queries />

            <SfButton
              id='btn-tb-trade-entry'
              label='Trade Entry'
              onClick={() => {
                setTradeEntryOpen(true);
              }}
            />
          </>
        }>
        <MainGrid />
      </SfPage>

      <TradeEntryDrawer isOpen={isTradeEntryOpen} onClose={() => setTradeEntryOpen(false)} />

      <TradeActionsManager />
    </>
  );
};

export default MainLayout;
