import { ISfDataGridOptions } from '@sfcm/shared';

export const gridOptions: ISfDataGridOptions = {
  metadataParams: {
    gridId: 'activities',
  },
  agGridOptions: {
    // rowSelection: {
    //   mode: AG_ROW_SELECTION_MODE_MULTIPLE,
    // },
    autoSizeStrategy: {
      type: 'fitCellContents',
    },
    grandTotalRow: 'pinnedBottom',
  },
};
