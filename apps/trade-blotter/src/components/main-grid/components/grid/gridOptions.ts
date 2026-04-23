import { AG_ROW_SELECTION_MODE_MULTIPLE } from '@sfcm/grid';
import { ISfDataGridOptions } from '@sfcm/shared';

export const gridOptions: ISfDataGridOptions = {
  metadataParams: {
    gridId: 'tradeBlotter',
  },
  agGridOptions: {
    rowSelection: {
      mode: AG_ROW_SELECTION_MODE_MULTIPLE,
    },
    autoSizeStrategy: {
      type: 'fitCellContents',
    },
    grandTotalRow: 'pinnedBottom',
    statusBar: {
      statusPanels: [{ statusPanel: 'agSelectedRowCountComponent', align: 'left' }],
    },
  },
};
