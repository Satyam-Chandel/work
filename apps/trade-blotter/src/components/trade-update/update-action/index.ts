import { IActionModalConfig } from '../../../trade-actions/types';

export { default as Drawer } from './ActionModal';

const ALLOWED_STATUSES = ['Unverified', 'Pending'];

export const actionModalConfig: IActionModalConfig = {
  id: 'cancelAndCorrect',
  title: 'Cancel And Correct Trade',
  menuName: 'Cancel & Correct',
  isMenuEnabled: (data: any[]) => {
    if (data?.length !== 1) return false;
    const row = data[0];
    return ALLOWED_STATUSES.includes(row?.status);
  },
};
