import { ISfRequestData, ISfRequestResponse, ISfUser, SfApiServiceName } from '@sfcm/shared'
import { GET_TRADE_BLOTTER_ACTIVITIES_URL } from './serviceUrls';

export const getTradeBlotterActivitiesApi = (
  requestData: ISfRequestData,
  user: ISfUser,
  params: any
): Promise<ISfRequestResponse> => {
  return requestData(
    GET_TRADE_BLOTTER_ACTIVITIES_URL,
    SfApiServiceName.HouseTradingEngine,
    params,
    user
  );
};
