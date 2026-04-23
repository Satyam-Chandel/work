import { GeneralTradeTypeEnum, IContextData } from './types';

export const DefaultContextData: IContextData = {
  IsBusy: true,
  IsEventsBusy: false,
  IsTradeEntryFormValid: false,
  GeneralTradeType: GeneralTradeTypeEnum.Classic,
  InitialDefaultValues: {},
  StaticDropdowns: {
    isReady: false,
    data: [],
  },
  BlotterQueryList: {
    isReady: false,
    data: [],
  },
  ShowEvents: false,
  EventList: [],
};
