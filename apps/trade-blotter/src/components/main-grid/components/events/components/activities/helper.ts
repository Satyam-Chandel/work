import { SfUserMessageType } from '@sfcm/framework';
import { ISendSfMessage, ISfRequestData, ISfUser } from '@sfcm/shared';
import { getTradeBlotterActivitiesApi } from './api';
import { translateToService } from './translation';

export const getTradeBlotterActivities = (
  requestData: ISfRequestData,
  user: ISfUser,
  sendMessage: ISendSfMessage,
  trade: any
): Promise<any[]> => {
  return getTradeBlotterActivitiesApi(requestData, user, translateToService(trade)).then(
    (response) => {
      if (response.ok) {
        return response.data?.activities ?? [];
      } else {
        sendMessage(`${response.status}: ${response.statusText}`, SfUserMessageType.Error);
        return [];
      }
    }
  );
};
