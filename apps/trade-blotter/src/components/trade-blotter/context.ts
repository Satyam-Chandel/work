import { createSfContext } from '@sfcm/framework';
import { DefaultContextData } from './helper';
import { IContextData } from './types';

export const ACTION_SUBMIT_TRADE = 'SubmitTrade';
export const ACTION_CLEAR_TRADE_ENTRY = 'ClearTradeEntry';
export const ACTION_RESET_TRADE_DEFAULTS = 'ResetTradeDefaults';
export const ACTION_CALCULATE_DEFAULTS = 'CalculateDefaults';
export const ACTION_CALL_TRADE_ACTION = 'CallTradeAction';

export const Context = createSfContext<IContextData>(DefaultContextData, [
  ACTION_SUBMIT_TRADE,
  ACTION_CLEAR_TRADE_ENTRY,
  ACTION_RESET_TRADE_DEFAULTS,
  ACTION_CALCULATE_DEFAULTS,
  ACTION_CALL_TRADE_ACTION,
]);
