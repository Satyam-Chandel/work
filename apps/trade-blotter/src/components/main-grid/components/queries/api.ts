import { ISfRequestData, ISfRequestResponse, ISfUser, SfApiServiceName } from '@sfcm/shared';
import { GET_GRID_QUERIES_URL } from './serviceUrls';

export const getDataGridQueriesApi = (
  requestData: ISfRequestData,
  user: ISfUser,
  params: any
): Promise<ISfRequestResponse> => {
  return requestData(GET_GRID_QUERIES_URL, SfApiServiceName.HouseTradingEngine, params, user);
};
