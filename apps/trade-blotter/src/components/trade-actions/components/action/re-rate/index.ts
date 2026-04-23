import { IActionModalConfig } from './../../../../types';

export { default as Modal } from './ActionModal';

export const actionModalConfig: IActionModalConfig = {
  id: 'rerate',
  title: 'Confirm Rate Changes',
  menuName: 'Re-rate',
  toolTip: 'Re-Rate applicable only for Variable Trades',
  isMenuEnabled: (data: any[]) => {
    const tradeType = data[0]?.tradeType;
    return data.every((item) => {
      return (
        item?.status === 'Settled' &&
        ((tradeType === 'Repo' || tradeType === 'Reverse Repo') &&
          item?.rateType === 'Variable') ||
        ((tradeType === 'Loan' || tradeType === 'Borrow') &&
          (item?.index === null || item?.index === ''))
      );
    });
  },
};
