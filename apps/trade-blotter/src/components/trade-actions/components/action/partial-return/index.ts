import { IActionModalConfig } from './../../../../types';

export { default as Modal } from './ActionModal';

export const actionModalConfig: IActionModalConfig = {
  id: 'partialReturn',
  title: 'Confirm Partial Return',
  menuName: 'Partial-Return',
  isMenuEnabled: (data: any[]) => {
    return (
      data?.length === 1 &&
      data[0]?.status === 'Settled' &&
      (data[0]?.tradeType === 'Repo' ||
        data[0]?.tradeType === 'Reverse Repo' ||
        data[0]?.tradeType === 'Loan') &&
      (data[0]?.termType === 'Term' ||
        (data[0]?.termType === 'Open' &&
          Math.abs(data[0]?.outstandingQuantityIncPendingReturns) > 0))
    );
  },
};
