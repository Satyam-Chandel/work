import { IActionModalConfig } from './../../../../types';

export { default as Modal } from './ActionModal';

export const actionModalConfig: IActionModalConfig = {
  id: 'settleDelivery',
  title: 'Settle Delivery',
  isMenuEnabled: (data: any[]) => {
    console.log('Checking if Settle Delivery is enabled with data:', data);
    return data?.find((x) => x.status === 'Pending');
  },
};
