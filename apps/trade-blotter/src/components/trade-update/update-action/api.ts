import { ISFRequestData, ISFRequestResponse, ISfUser, SfApiServiceName } from '@sfcm/shared';
import { AMEND_TRADE_URL } from './serviceUrls';

export const amendTradeApi = (
  requestData: ISFRequestData,
  user: ISfUser,
  params: any
): Promise<ISFRequestResponse> => {
  return requestData(
    AMEND_TRADE_URL,
    SfApiServiceName.HouseTradingEngine,
    params,
    user,
    undefined,
    true
  );
};
