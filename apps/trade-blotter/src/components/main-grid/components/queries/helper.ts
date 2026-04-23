import { SfUserMessageType } from '@sfcm/framework';
import { ISendSfMessage, ISfRequestData, ISfUser } from '@sfcm/shared';
import { getDataGridQueriesApi } from './api';

export const getDataGridQueries = (
  requestData: ISfRequestData,
  user: ISfUser,
  sendMessage: ISendSfMessage,
  gridId: string
): Promise<any | null> => {
  return getDataGridQueriesApi(requestData, user, { gridName: gridId }).then((response) => {
    if (response.ok) {
      console.log('QUERIES', response.data);

      return response.data?.gridQueries?.gridQueries;
    } else {
      sendMessage(`${response.status}: ${response.statusText}`, SfUserMessageType.Error);
      return null;
    }
  });
};
