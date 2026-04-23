import { SfUserMessageType } from '@sfcm/framework';
import { ISendSfMessage, ISfRequestData, ISfUser } from '@sfcm/shared';
import { getTradeBlotterSettlementsApi } from './api';
import { translateToService } from './translation';

export const getTradeBlotterSettlements = (
  requestData: ISfRequestData,
  user: ISfUser,
  sendMessage: ISendSfMessage,
  tradeList: any[]
): Promise<any[]> => {
  return getTradeBlotterSettlementsApi(requestData, user, translateToService(tradeList)).then(
    (response) => {
      if (response.ok) {
        console.log('SETTLEMENTS', response.data);

        return response.data?.entities ?? [];
      } else {
        sendMessage(`${response.status}: ${response.statusText}`, SfUserMessageType.Error);
        return [];
      }
    }
  );
};
