import { ISfContextData } from '@sfcm/framework';
import { IActionModule } from 'components/trade-actions/types';

export enum GeneralTradeTypeEnum {
  Classic = 'Classic',
  Triparty = 'Triparty',
}

export interface IStaticDrpodwnData {
  isReady: boolean;
  data: {
    dropdownType: string;
    values: {
      value: string;
      label: string;
      attributes?: {
        type: string;
        value: string;
      }[];
    }[];
  }[];
}

export interface IBlotterQueriesData {
  isReady: boolean;
  data: any[];
}

export interface IContextData extends ISfContextData {
  IsBusy: boolean;
  IsEventsBusy: boolean;

  IsTradeEntryFormValid: boolean;
  GeneralTradeType: GeneralTradeTypeEnum;

  InitialDefaultValues?: any;
  DefaultValues?: any;
  StaticDropdowns: IStaticDrpodwnData;

  BlotterQueryList: IBlotterQueriesData;
  SelectedBlotterQuery?: { id: string; queryComponents: any };

  SelectedItem?: any;
  SelectedItems?: any[];

  ShowEvents: boolean;
  EventList: IActionModule[];
}
