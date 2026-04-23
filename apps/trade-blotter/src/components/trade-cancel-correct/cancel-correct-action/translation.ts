import { str, uuid } from '@sfcm/framework';
import { SF } from '@sfcm/modules';

const getInterestRateType = (trade: any): string => {
  if (trade[SF.PRODUCT_TYPE] === 'Repo') return trade[SF.RATE_TYPE];
  if (
    trade[SF.PRODUCT_TYPE] === 'Loan' ||
    (trade[SF.TRADE_TYPE] === 'Borrow' || trade[SF.TRADE_TYPE] === 'Loan')
  ) {
    if (str.isNotEmpty(trade[SF.MIN_FEE]) || str.isNotEmpty(trade[SF.RATE_FEE])) {
      return 'RebateRate';
    }
    if (str.isNotEmpty(trade[SF.FEE])) return 'FeeTrade';
  }
  return trade[SF.RATE_TYPE];
};

/**
 * Translates a Trade Blotter grid row (bindingName keys) into the flat object
 * shape expected by the QuickEntry formik form (SF constant keys).
 *
 * Most field names align directly; this function handles the exceptions and
 * normalises dates to YYYY-MM-DD strings.
 */
export const translateToFormValues = (row: any): any => {
  if (!row) return {};

  const dateStr = (val: any): string | undefined =>
    val ? String(val).substring(0, 10) : undefined;
  const normalizeTradeType = (val: any): string =>
    String(val ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

  const tradeType = String(row.tradeType ?? '');
  const normalizedTradeType = normalizeTradeType(tradeType);
  const isLoanBorrow = ['loan', 'borrow'].includes(normalizedTradeType);
  const isBankLoan = ['bankloan', 'bankborrow'].includes(normalizedTradeType);
  const isBuyOrSellBack = ['buysellback', 'sellbuyback'].includes(normalizedTradeType);

  return {
    // Direct carryovers (bindingName matches SF constant value)
    [SF.TRADE_TYPE]: normalizedTradeType,
    [SF.PRODUCT_TYPE]: row.productType,
    [SF.COMPANY]: row.company,
    [SF.BOOK]: row.book,
    [SF.CURRENCY]: row.currency,
    [SF.QUANTITY]: row.quantity,
    [SF.MONEY]: row.money,
    [SF.END_MONEY]: row.endMoney,
    [SF.DIRTY_PRICE]: row.dirtyPrice,
    [SF.ALL_IN_PRICE]: row.allInPrice ?? row.price,
    [SF.CLEAN_PRICE]: row.cleanPrice ?? row.price,
    [SF.HAIRCUT]: row.haircut,
    [SF.RATE_TYPE]: row.rateType,
    [SF.RATE_FEE]: row.rateFee,
    [SF.ISIN]: row.isin,
    [SF.INSTRUMENT_ID]: row.security,
    [SF.AGREEMENT_ID]: row.agreementId,
    [SF.AGREEMENT_NAME]: row.agreementName,
    [SF.TERM_TYPE]: row.termType,
    [SF.FX_RATE]: row.fxRate,
    [SF.MARGIN]: row.margin ?? row.loanMargin,
    [SF.COLLATERAL_TYPE_ID]: row.collateralTypeId,
    [SF.COLLATERAL_ELIGIBILITY]: row.collateralDistinction,
    [SF.SPREAD_OFFSET]: row.spreadOffset,
    [SF.BROKER]: row.broker,
    [SF.BROKER_FEE]: row.brokerFee,
    [SF.SALESPERSON]: row.salesPerson,
    [SF.SALES_CREDIT]: row.salesCredit,
    [SF.INTERNAL_NARRATIVE]: row.internalNarrative,
    [SF.EXTERNAL_NARRATIVE]: row.externalNarrative,
    [SF.INTEREST_METHOD]: row.interestMethod,
    [SF.COUPON_METHOD]: row.couponMethod,
    [SF.DAY_COUNT]: row.dayCount,
    [SF.PURCHASER_ID]: row.purchaserId,
    [SF.TRIPARTY_ACCOUNT]: row.tripartyAccount,
    [SF.PROFILE_OVERLAY]: row.profileOverlay,
    [SF.RE_PRICE]: row.rePrice,
    [SF.MIN_FEE]: row.minFee,
    [SF.FEE]: row.fee,
    [SF.COMPANY_BANK_ACCOUNT]: row.companyBankAccount,
    [SF.COMPANY_DEPOT_ACCOUNT]: row.companyDepotAccount,
    [SF.CLIENT_BANK_ACCOUNT]: row.clientBankAccount,
    [SF.CLIENT_DEPOT_ACCOUNT]: row.clientDepotAccount,
    [SF.COMPANY_MEDIUM]: row.companyMedium,
    [SF.IS_LOAN_BORROW]: isLoanBorrow,
    [SF.IS_BANK_LOAN]: isBankLoan,
    [SF.IS_BUY_OR_SELL_BACK]: isBuyOrSellBack,

    // Key remaps: grid bindingName differs from SF constant key
    [SF.COUNTERPARTY]: row.clientId ?? row.counterparty,

    // Dates normalised to YYYY-MM-DD
    [SF.START_DATE]: dateStr(row.startDate),
    [SF.END_DATE]: dateStr(row.endDate),
    [SF.TRADE_DATE]: dateStr(row.tradeDate),
    [SF.SETTLE_DATE]: dateStr(row.settleDate ?? row.stockSettlementDate),

    // Trade reference carried for update identification
    tradeId: row.tradeId,
  };
};

export const translateToService = (trade: any): any => {
  return {
    uuid: uuid.generate(),
    source: 'SFCM',
    userName: trade[SF.USERNAME],
    transactionType: trade[SF.TRADE_TYPE],
    securities: [
      {
        quantities: [
          {
            type: 'TransactionQuantity',
            value: trade[SF.QUANTITY],
            instrumentIdentifier: {
              role: 'PrimaryInstrument',
              type: 'ISIN',
              value: trade[SF.ISIN],
            },
          },
        ],
        prices: [
          { type: 'Price', subType: 'Clean', value: trade[SF.CLEAN_PRICE], notation: null },
          { type: 'Price', subType: 'Dirty', value: trade[SF.DIRTY_PRICE], notation: null },
        ],
        price: { type: 'AllInPrice', value: trade[SF.ALL_IN_PRICE] },
        rates: [{ type: 'Haircut', value: trade[SF.HAIRCUT], multiplyDivide: 'multiply' }],
        amounts: [
          { type: 'StartLegCash', value: trade[SF.MONEY], currency: trade[SF.CURRENCY] },
          { type: 'EndLegCash', value: trade[SF.END_MONEY], currency: trade[SF.CURRENCY] },
          { type: 'Interest', value: trade[SF.INTEREST], currency: trade[SF.CURRENCY] },
        ],
      },
    ],
    rates: [
      { type: 'ExchangeRate', value: trade[SF.FX_RATE] },
      { type: 'Haircut', value: trade[SF.HAIRCUT] },
    ],
    transactionFees: [
      {
        type: 'ExecutingBrokerFee',
        value: str.isEmpty(trade[SF.BROKER_FEE]) ? trade[SF.SALES_CREDIT] : trade[SF.BROKER_FEE],
      },
      { type: 'CouponCompensation', value: trade[SF.COUPON_COMPENSATION] },
      { type: 'MinimumFeeAmount', value: trade[SF.MIN_FEE] },
      { type: 'LoanMargin', value: trade[SF.MARGIN] },
    ],
    interestRates: [
      {
        benchmark: trade[SF.RATE_TYPE] === 'Floating' ? trade[SF.RATE_INDEX_CODE] : '',
        rateType: getInterestRateType(trade),
        spread: trade[SF.RATE_TYPE] === 'Floating' ? trade[SF.SPREAD_OFFSET] : '',
        dayCount: trade[SF.DAY_COUNT],
        value:
          trade[SF.PRODUCT_TYPE] === 'Repo' || !str.isEmpty(trade[SF.RATE_FEE])
            ? trade[SF.RATE_FEE]
            : trade[SF.FEE],
      },
    ],
    classifications: [
      { type: 'FinancingContractTerm', value: trade[SF.TERM_TYPE] },
      {
        type: 'InterestPaymentFrequency',
        value: trade[SF.IS_LOAN_BORROW] ? trade[SF.BILL_METHOD] : trade[SF.INTEREST_METHOD],
      },
      { type: 'CallableIndicator', value: trade[SF.CALLABLE] },
      { type: 'SettlementTerms', value: trade[SF.DELIVERY_INSTRUCTIONS] },
      { type: 'CouponMethod', value: trade[SF.COUPON_METHOD] },
      { type: 'ProfileOverlay', value: trade[SF.PROFILE_OVERLAY] },
      { type: 'AllowRevaluation', value: trade[SF.RE_PRICE] },
    ],
    narratives: [
      { type: 'CollateralProfile', value: trade[SF.COLLATERAL_TYPE_ID] },
      { type: 'ExternalNarrative', value: trade[SF.EXTERNAL_NARRATIVE] },
      { type: 'InternalNarrative', value: trade[SF.INTERNAL_NARRATIVE] },
    ],
    dates: [
      { type: 'TransactionDate', value: trade[SF.TRADE_DATE] },
      { type: 'ContractualStartDate', value: trade[SF.START_DATE] },
      { type: 'ContractualEndDate', value: trade[SF.END_DATE] },
      { type: 'AgreedSettlementDate', value: trade[SF.SETTLE_DATE] ?? trade[SF.START_DATE] },
      { type: 'AgreedCollateralDate', value: trade[SF.SETTLE_DATE] ?? trade[SF.START_DATE] },
    ],
    currencies: [{ type: 'SettlementCurrency', value: trade[SF.CURRENCY] }],
    partyIdentifiers: [
      { role: 'TradingAccount', type: 'Internal', value: trade[SF.BOOK] },
      { role: 'Entity', type: 'Internal', value: trade[SF.COMPANY] },
      { role: 'Counterparty', type: 'Internal', value: trade[SF.COUNTERPARTY] },
      {
        role: 'Broker',
        type: 'Internal',
        value: str.isEmpty(trade[SF.BROKER]) ? trade[SF.SALESPERSON] : trade[SF.BROKER],
      },
      { role: 'TripartyAccount', type: 'Internal', value: trade[SF.TRIPARTY_ACCOUNT] },
      { role: 'PurchaserId', type: 'Internal', value: trade[SF.PURCHASER_ID] },
    ],
    depotAccounts: [
      {
        depotAccountType: 'EntityDepot',
        code: trade[SF.COMPANY_DEPOT_ACCOUNT_CODE],
        accountNumber: trade[SF.COMPANY_DEPOT_ACCOUNT],
        mediumCode: trade[SF.COMPANY_MEDIUM],
      },
      {
        depotAccountType: 'PartyDepot',
        code: trade[SF.CLIENT_DEPOT_ACCOUNT_CODE],
        accountNumber: trade[SF.CLIENT_DEPOT_ACCOUNT],
      },
      {
        depotAccountType: 'PartyBank',
        code: trade[SF.CLIENT_BANK_ACCOUNT_CODE],
        accountNumber: trade[SF.CLIENT_BANK_ACCOUNT],
      },
      {
        depotAccountType: 'EntityBank',
        code: trade[SF.COMPANY_BANK_ACCOUNT_CODE],
        accountNumber: trade[SF.COMPANY_BANK_ACCOUNT],
        mediumCode: trade[SF.COMPANY_MEDIUM],
      },
    ],
    agreement: { id: trade[SF.AGREEMENT_ID] },
  };
};
