import { IActionModalConfig } from './../../../../types';

export { default as Modal } from './ActionModal';

export const actionModalConfig: IActionModalConfig = {
  id: 'unSettle',
  title: 'UnSettle',
  isMenuEnabled: (data: any[]) => {
    return data?.length === 1 && data[0]?.status === 'Settled';
  },
};
