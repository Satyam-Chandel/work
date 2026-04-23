import { SfUserMessageType, str } from '@sfcm/framework';
import { ISendSfMessage, ISfRequestData, ISfUser } from '@sfcm/shared';
import { translateToService } from './translation';
import { performActionOnMultipleTrade, performActionOnSingleTrade } from '../api';

export const verifyTrades = (
  requestData: ISfRequestData,
  user: ISfUser,
  sendMessage: ISendSfMessage,
  tradeList: any[]
): Promise<{ ok: boolean; statusText: string; uuid: string }> => {
  const serviceFormat = translateToService(tradeList);
  console.log('Verifying trades', serviceFormat);
  if (str.isNotEmpty(serviceFormat.batchUuid)) {
    return performActionOnMultipleTrade(requestData, user, serviceFormat).then((response) => {
      console.log('Verify response for bulk trade', response);
      if (response.ok) {
        return { ok: true, statusText: response.statusText, uuid: serviceFormat.batchUuid };
      } else {
        sendMessage(`${response.status}: ${response.statusText}`, SfUserMessageType.Error);
        return { ok: false, statusText: response.statusText, uuid: '' };
      }
    });
  } else {
    return performActionOnSingleTrade(requestData, user, serviceFormat).then((response) => {
      console.log('Verify response for single trade', response);
      if (response.ok) {
        return { ok: true, statusText: response.statusText, uuid: serviceFormat.uuid };
      } else {
        sendMessage(`${response.status}: ${response.statusText}`, SfUserMessageType.Error);
        return { ok: false, statusText: response.statusText, uuid: '' };
      }
    });
  }
};
