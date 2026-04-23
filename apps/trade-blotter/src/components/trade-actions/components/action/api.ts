import { ISfRequestData, ISfRequestResponse, ISfUser, SfApiServiceName } from '@sfcm/shared';
import {
  CREATE_LIFECYCLE_BATCH_EVENT_URL,
  CREATE_LIFECYCLE_EVENT_URL,
  GET_SYSTEM_CONFIG_URL,
} from './serviceUrls';

export const performActionOnSingleTrade = (
  requestData: ISfRequestData,
  user: ISfUser,
  params: any
): Promise<ISfRequestResponse> => {
  return requestData(
    CREATE_LIFECYCLE_EVENT_URL,
    SfApiServiceName.HouseTradingEngine,
    params,
    user,
    undefined,
    true
  );
};

export const performActionOnMultipleTrade = (
  requestData: ISfRequestData,
  user: ISfUser,
  params: any
): Promise<ISfRequestResponse> => {
  return requestData(
    CREATE_LIFECYCLE_BATCH_EVENT_URL,
    SfApiServiceName.HouseTradingEngine,
    params,
    user,
    undefined,
    true
  );
};

export const getSystemConfig = (
  requestData: ISfRequestData,
  user: ISfUser,
  params: any
): Promise<ISfRequestResponse> => {
  return requestData(GET_SYSTEM_CONFIG_URL, SfApiServiceName.HouseTradingEngine, params, user);
};
