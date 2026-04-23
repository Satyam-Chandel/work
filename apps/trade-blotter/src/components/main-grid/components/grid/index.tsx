import { str } from '@sfcm/framework';
import { GetContextMenuItemsParams, ISfContextMenuItem } from '@sfcm/grid';
import { ISfDataGrid, ISfRequestData, ISfUser, SfDataGrid, useRealTimeUpdates } from '@sfcm/shared';
import { getTradeBlotterApi } from 'components/main-grid/api';
import { GET_TRADE_TOPIC } from 'components/main-grid/serviceUrls';
import { ACTION_CALL_TRADE_ACTION, Context } from 'components/trade-blotter/context';
import { useContext, useEffect, useRef, useState } from 'react';
import { gridOptions } from './gridOptions';

const Grid = (): JSX.Element => {
  const grid = useRef<ISfDataGrid>(null);
  const { data, setData, callAction } = useContext(Context);
  const [isGridReady, setGridReady] = useState(false);

  const { refresh } = useRealTimeUpdates({
    updateTopic: GET_TRADE_TOPIC,
    getData: (requestData: ISfRequestData, user: ISfUser, params: any) => {
      return getTradeBlotterApi(requestData, user, {
        ...params,
        queryComponents: {
          ...queryComponents,
          ...data.SelectedBlotterQuery?.queryComponents,
        },
      });
    },
    onDataLoaded: (loadData: any) => {
      if (loadData?.entities) {
        console.log('LOADED', loadData.entities);
        grid.current?.setData(loadData.entities);
      }
      setData({ IsBusy: false });
    },
    onDataUpdated: (updateData: any) => {
      if (updateData?.entities) {
        console.log('UPDATED', updateData.entities);
        grid.current?.updateData(updateData.entities);
      }
    },
    isReady: isGridReady,
    refreshOnMount: false,
  });

  useEffect(() => {
    if (isGridReady && str.isNotEmpty(data.SelectedBlotterQuery?.id)) {
      setData({ IsBusy: true });
      refresh();
    }
  }, [data.SelectedBlotterQuery?.id, isGridReady]);

  const handleSelectionChanged = () => {
    const selectedRows = grid.current?.getSelectedRows();
    setData({ SelectedItems: selectedRows ? selectedRows : [] });

    if (selectedRows?.length === 1) {
      setData({ SelectedItem: selectedRows[0] });
    } else {
      setData({ SelectedItem: null });
    }
  };

  const handleContextMenuRequest = (e: GetContextMenuItemsParams): ISfContextMenuItem[] => {
    const selectedRows = grid.current?.getSelectedRows();
    return [
      {
        name: 'Events',
        checked: data.ShowEvents,
        action: () => {
          setData({ ShowEvents: !data.ShowEvents });
        },
      },
      ...getTradeActions(selectedRows || []),
    ];
  };

  const getTradeActions = (selectedRows: any[]): ISfContextMenuItem[] =>
    data.EventList.map((x) => {
      const menuOptionDisabled = !x.actionModalConfig?.isMenuEnabled(selectedRows);
      return {
        name: x.actionModalConfig?.menuName ?? x.actionModalConfig?.title ?? '',
        disabled: menuOptionDisabled,
        action: () => {
          console.log(`${x?.actionModalConfig?.id} action called`);
          callAction(ACTION_CALL_TRADE_ACTION, {
            id: x.actionModalConfig?.id,
            items: selectedRows,
          });
        },
        tooltip: menuOptionDisabled
          ? x.actionModalConfig?.tooltip ?? 'Action not available for this trade type/status'
          : '',
      };
    });

  return (
    <SfDataGrid
      id='grid-trade-blotter'
      ref={grid}
      gridOptions={gridOptions}
      onGridReady={() => setGridReady(true)}
      onSelectionChanged={handleSelectionChanged}
      onContextMenuRequest={handleContextMenuRequest}
    />
  );
};

export default Grid;
