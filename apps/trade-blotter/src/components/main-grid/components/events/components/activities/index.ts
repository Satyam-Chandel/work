import {
  ISfDataGrid,
  SfDataGrid,
  useAuthentication,
  useMessageService,
  usePostDataRequest,
} from '@sfcm/shared';
import Context from 'components/trade-blotter/context';
import { useContext, useEffect, useRef, useState } from 'react';
import { gridOptions } from './gridOptions';
import { getTradeBlotterActivities } from './helper';
import { EventsBlockingMessage, EventsContainer } from './styled';

const Activities = (): JSX.Element => {
  const grid = useRef<ISfDataGrid>(null);
  const { data, setData } = useContext(Context);

  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Activities');
  const { user } = useAuthentication();

  const [isGridReady, setGridReady] = useState(false);
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    if (isGridReady) {
      if (data.SelectedItems?.length === 1) {
        setActive(true);
        setData({ IsEventsBusy: true });

        getTradeBlotterActivities(requestData, user, sendMessage, data.SelectedItem)
          .then((result) => {
            grid.current?.setData(result);
          })
          .finally(() => setData({ IsEventsBusy: false }));
      } else if (data.SelectedItems?.length === 0) {
        setActive(true);
        grid.current?.clearData();
      } else {
        setActive(false);
        grid.current?.clearData();
      }
    }
  }, [data.SelectedItems, isGridReady]);

  useEffect(() => {
    if (isGridReady) {
      if (data.SelectedItem?.tradeId) {
        setData({ IsEventsBusy: true });

        getTradeBlotterActivities(requestData, user, sendMessage, data.SelectedItem)
          .then((result) => {
            grid.current?.setData(result);
          })
          .finally(() => setData({ IsEventsBusy: false }));
      } else {
        grid.current?.clearData();
      }
    }
  }, [data.SelectedItem?.tradeId, isGridReady]);

  return (
    <EventsContainer>
      {isActive === false && (
        <EventsBlockingMessage>
          Select a single record in the Blotter to display Activities
        </EventsBlockingMessage>
      )}

      <SfDataGrid
        id='grid-tb-activities'
        ref={grid}
        gridOptions={gridOptions}
        onGridReady={() => setGridReady(true)}
      />
    </EventsContainer>
  );
};

export default Activities;
