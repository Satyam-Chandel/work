import { IActionModalConfig } from '../../../types';

export { default as Modal } from './ActionModal';

export const actionModalConfig: IActionModalConfig = {
  id: 'cancel',
  title: 'Cancel',
  isMenuEnabled: (data: any[]) => {
    return data?.every((x) => x.status === 'Unverified' || x.status === 'Pending');
  },
};
