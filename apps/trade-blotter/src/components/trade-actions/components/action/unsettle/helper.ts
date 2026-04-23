import { SfUserMessageType, str } from '@sfcm/framework';
import { ISendSfMessage, ISfRequestData, ISfUser } from '@sfcm/shared';
import { translateToService } from './translation';
import { performActionOnSingleTrade } from '../api';

export const unsettledeliveryTrades = (
  requestData: ISfRequestData,
  user: ISfUser,
  sendMessage: ISendSfMessage,
  tradeList: any[]
): Promise<{ ok: boolean; statusText: string; uuid: string }> => {
  const serviceFormat = translateToService(tradeList);
  console.log('unsettling trades', serviceFormat);
  return performActionOnSingleTrade(requestData, user, serviceFormat).then((response) => {
    console.log('Unsettle response for single trade', response);
    if (response.ok) {
      return { ok: true, statusText: response.statusText, uuid: serviceFormat.uuid };
    } else {
      sendMessage(`${response.status}: ${response.statusText}`, SfUserMessageType.Error);
      return { ok: false, statusText: response.statusText, uuid: '' };
    }
  });
};
