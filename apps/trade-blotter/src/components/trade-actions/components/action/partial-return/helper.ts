import { SfUserMessageType } from '@sfcm/framework';
import { ISfRequestData, ISfUser, ISendSfMessage } from '@sfcm/shared';
import { translateToService } from './translation';
import { performActionOnSingleTrade } from '../api';

export const partialReturn = (
  requestData: ISfRequestData,
  user: ISfUser,
  sendMessage: ISendSfMessage,
  trade: any
): Promise<{ok:boolean , uuid:string}> => {
  const serviceData = translateToService(trade , user.userName);
  console.log('Service Data ', serviceData);
  return performActionOnSingleTrade(requestData, user, serviceData).then((response) => {
    console.log('Partial Return response', response);
    if (response.ok) {
      return { ok: true, uuid: serviceData.uuid};
    } else {
      sendMessage(`${response.status}: ${response.statusText}`, SfUserMessageType.Error);
      return {ok: false, uuid: ''};
    }
  });
};
