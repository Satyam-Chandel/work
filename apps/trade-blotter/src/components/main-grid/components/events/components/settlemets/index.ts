import {
  ISfDataGrid,
  SfDataGrid,
  useAuthentication,
  useMessageService,
  usePostDataRequest,
} from '@sfcm/shared';
import { Context } from 'components/trade-blotter/context';
import { useContext, useEffect, useRef, useState } from 'react';
import { gridOptions } from './gridOptions';
import { getTradeBlotterSettlements } from './helper';

const Activities = (): JSX.Element => {
  const grid = useRef<ISfDataGrid>(null);
  const { data, setData } = useContext(Context);

  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Settlements');
  const { user } = useAuthentication();

  const [isGridReady, setGridReady] = useState(false);

  useEffect(() => {
    if (isGridReady) {
      if (data.SelectedItems && data.SelectedItems.length > 0) {
        setData({ IsEventsBusy: true });

        getTradeBlotterSettlements(requestData, user, sendMessage, data.SelectedItems)
          .then((result) => {
            grid.current?.setData(result);
          })
          .finally(() => setData({ IsEventsBusy: false }));
      } else {
        grid.current?.clearData();
      }
    }
  }, [data.SelectedItems, isGridReady]);

  return (
    <SfDataGrid
      id='grid-tb-settlements'
      ref={grid}
      gridOptions={gridOptions}
      onGridReady={() => setGridReady(true)}
    />
  );
};

export default Activities;
