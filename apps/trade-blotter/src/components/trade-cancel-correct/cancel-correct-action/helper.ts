import { ISFRequestData, ISfUser } from '@sfcm/shared';
import { SF } from 'components/shared/sf-entities/const';
import { translateToService } from './translation';
import { cancelAndCorrectTradeApi } from './api';

export const cancelAndCorrectTrade = (
  requestData: ISFRequestData,
  user: ISfUser,
  tradeData: any
): Promise<{ ok: boolean; statusText: string; uuid: string }> => {
  const tradeDataServiceFormat = {
    ...translateToService({ ...tradeData, [SF.USERNAME]: user.userName }),
    actionType: 'CancelAndCorrect',
    identifiers: [
      {
        type: 'InternalReference',
        value: tradeData.tradeId?.toString() ?? 'string',
      },
    ],
  };

  return cancelAndCorrectTradeApi(requestData, user, tradeDataServiceFormat).then((response) => {
    if (response.ok) {
      return { ok: true, statusText: response.statusText, uuid: tradeDataServiceFormat.uuid };
    } else {
      return { ok: false, statusText: response.statusText, uuid: '' };
    }
  });
};
