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

export const getUpdateFieldLocks = (values: any) => {
  const isRepoFamily = isRepoTrades(values);
  const isBankLoanBorrow = isBankLoanBorrowTrade(values);
  const isNonCash = isNonCashCollateralTrade(values);
  const isSbl = isSBLTrade(values);

  const lockTradeType = isSbl || isRepoFamily || isBankLoanBorrow || isNonCash;
  const lockBook = isRepoFamily || isBankLoanBorrow || isNonCash;
  const lockCounterparty = isSbl || isRepoFamily || isBankLoanBorrow || isNonCash;
  const lockSecurity = isSbl || isRepoFamily || isNonCash;
  const lockAgreement = isSbl || isRepoFamily;
  const lockFxRate = isNonCash;
  const lockDeliveryInstructions = isNonCash;
  const lockLoanBorrowMode = getLoanBorrowMode(values);

  return {
    lockTradeType,
    lockBook,
    lockCounterparty,
    lockSecurity,
    lockAgreement,
    lockFxRate,
    lockDeliveryInstructions,
    lockLoanBorrowMode,
  };
};
