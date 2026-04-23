import { ISfRequestData, ISfRequestResponse, ISfUser, SfApiServiceName } from '@sfcm/shared';
import { GET_DATA_URL } from './serviceUrls';

export const getTradeBlotterDataApi = (
  requestData: ISfRequestData,
  user: ISfUser,
  params: any
): Promise<ISfRequestResponse> => {
  return requestData(GET_DATA_URL, SfApiServiceName.HouseTradingEngine, params, user);
};
