import { SfUserMessageType } from '@sfcm/framework';
import { ISendSfMessage, ISfRequestData, ISfUser } from '@sfcm/shared';
import { translateToService } from './translation';
import { performActionOnSingleTrade } from '../api';

export const fullReturnTrades = (
  requestData: ISfRequestData,
  user: ISfUser,
  sendMessage: ISendSfMessage,
  trade: any
): Promise<{ ok: boolean; statusText: string; uuid: string }> => {
  const serviceFormat = translateToService(trade, user.userName);
  console.log('Service object for Full Return', serviceFormat);
  return performActionOnSingleTrade(requestData, user, serviceFormat).then((response) => {
    console.log('Full Return response for single trade', response);
    if (response.ok) {
      return { ok: true, statusText: response.statusText, uuid: serviceFormat.uuid };
    } else {
      sendMessage(`${response.status}: ${response.statusText}`, SfUserMessageType.Error);
      return { ok: false, statusText: response.statusText, uuid: '' };
    }
  });
};
