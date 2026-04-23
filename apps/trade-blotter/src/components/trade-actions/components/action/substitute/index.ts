import { IActionModalConfig } from './../../../../types';

export { default as Modal } from './ActionModal';

export const actionModalConfig: IActionModalConfig = {
  id: 'substitute',
  title: 'Confirm Security Substitution',
  menuName: 'Substitute',
  isMenuEnabled: (data: any[]) => {
    return (
      data?.length === 1 &&
      data[0]?.status === 'Settled' &&
      (data[0]?.tradeType === 'Repo' || data[0]?.tradeType === 'Reverse Repo')
    );
  },
};
