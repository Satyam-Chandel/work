import { IActionModalConfig } from '../../../types';

export { default as Modal } from './ActionModal';

export const actionModalConfig: IActionModalConfig = {
  id: 'fullreturn',
  title: 'Confirm Full Return',
  menuName: 'Full Return',
  isMenuEnabled: (data: any[]) => {
    const tradeType = data[0]?.tradeType;
    return [
      data?.length === 1 &&
        (data[0]?.status === 'Settled' ||
          ((tradeType === 'Loan' ||
            tradeType === 'Borrow' ||
            tradeType === 'Repo' ||
            tradeType === 'Reverse Repo') &&
            data[0]?.status === 'Pending')) &&
        data[0]?.termType === 'Open' &&
        Math.abs(data[0]?.outstandingQuantityIncPendingReturns) > 0,
    ];
  },
};
