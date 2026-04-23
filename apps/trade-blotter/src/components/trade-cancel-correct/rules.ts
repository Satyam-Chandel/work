import { SF } from '@sfcm/modules';

const normalize = (value: any): string => String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

export const isRepoTrades = (values: any): boolean => {
  const tradeType = normalize(values?.[SF.TRADE_TYPE]);
  return ['repo', 'reverserepo', 'revrepo', 'buysellback', 'sellbuyback'].includes(tradeType);
};

export const isBankLoanBorrowTrade = (values: any): boolean => {
  const tradeType = normalize(values?.[SF.TRADE_TYPE]);
  return ['bankloan', 'bankborrow'].includes(tradeType);
};

export const isNonCashCollateralTrade = (values: any): boolean => {
  const tradeType = normalize(values?.[SF.TRADE_TYPE]);
  return ['pledge', 'receive'].includes(tradeType);
};

export const isSBLTrade = (values: any): boolean => {
  const tradeType = normalize(values?.[SF.TRADE_TYPE]);
  return ['loan', 'borrow'].includes(tradeType);
};

export const getLoanBorrowMode = (values: any): 'rebate' | 'fee' | null => {
  const isLoanBorrow = isSBLTrade(values);

  if (!isLoanBorrow) {
    return null;
  }

  const hasFee = String(values?.[SF.FEE] ?? '') !== '';
  const hasRate = String(values?.[SF.RATE_FEE] ?? '') !== '';
  const hasRateType = String(values?.[SF.RATE_TYPE] ?? '') !== '';
  const hasMinFee = String(values?.[SF.MIN_FEE] ?? '') !== '';

  if (hasFee) {
    return 'fee';
  }

  if (hasRate || hasRateType || hasMinFee) {
    return 'rebate';
  }

  return null;
};
