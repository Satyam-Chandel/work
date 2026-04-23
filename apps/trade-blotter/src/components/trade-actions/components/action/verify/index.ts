import { IActionModalConfig } from './../../../../types';

export { default as Modal } from './ActionModal';

export const actionModalConfig: IActionModalConfig = {
  id: 'verify',
  title: 'Verify',
  isMenuEnabled: (data: any[]) => {
    console.log('Checking if Verify is enabled with data:', data);
    return data?.every((x) => x.status === 'Unverified');
  },
};
