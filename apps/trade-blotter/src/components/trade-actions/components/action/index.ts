import * as cancel from './cancel';
import { IActionModule } from './../../types';
import * as verify from './verify';
import * as reRate from './re-rate';
import * as rePrice from './re-price';
import * as settleDelivery from './settle-delivery';
import * as unSettle from './unsettle';
import * as fullReturn from './full-return';
import * as partialReturn from './partial-return';
import * as rollover from './rollover';
import * as substitute from './substitute';
import * as update from './../../trade-update/update-action';
import * as cancelAndCorrect from './../../../trade-cancel-correct/cancel-correct-action';

const modules: IActionModule[] = [
  verify,
  cancel,
  reRate,
  rePrice,
  settleDelivery,
  unSettle,
  fullReturn,
  partialReturn,
  rollover,
  substitute,
  update,
  cancelAndCorrect,
];

export const actionRegistry: IActionModule[] = modules.filter(
  (m): m is Required<IActionModule> =>
    m.actionModalConfig?.id !== undefined && (m.Modal !== undefined || m.Drawer !== undefined)
);
// .map((m) => ({ ...m.actionModalConfig, Modal: m.Modal }));
