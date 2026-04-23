import { uuid } from '@sfcm/framework';

const resolvePriceData = (clientObject: any) => {
  const selectedPriceType = clientObject?.priceType || 'allInPrice';

  if (selectedPriceType === 'cleanPrice') {
    return 'Clean';
  } else if (selectedPriceType === 'dirtyPrice') {
    return 'Dirty';
  }
  return 'AllIn';
};

const getRateType = (rateType: string) => {
  if (rateType === 'Floating') {
    return 'Floating';
  } else if (rateType === 'Variable') {
    return 'VariableInterestRate';
  } else if (rateType === 'Fixed') {
    return 'FixedInterestRate';
  }
  return '';
};

export const translateToService = (clientObject: any, userName: string): any => ({
  uuid: clientObject?.uuid ?? uuid.generate(),
  userName,
  transactionType: clientObject?.tradeType !== 'Reverse Repo' ? clientObject?.tradeType : 'RevRepo',
  identifiers: [
    {
      type: 'InternalReference',
      value: clientObject?.tradeId?.toString() ?? 'string',
    },
  ],
  dates: [
    {
      type: 'TransactionDate',
      value: clientObject?.startDate ?? '',
    },
    {
      type: 'ContractualStartDate',
      value: clientObject?.startDate ?? '',
    },
    {
      type: 'ContractualEndDate',
      value: clientObject?.endDate ?? '',
    },
    {
      type: 'EffectiveDate',
      value: clientObject?.startDate ?? '',
    },
    {
      type: 'InputDate',
      value: clientObject?.startDate ?? '',
    },
  ],
  securities: [
    {
      quantities: [
        {
          type: 'TransactionQuantity',
          value: clientObject?.quantity ?? 0,
          instrumentIdentifier: {
            type: 'CUSIP',
            value: clientObject?.securityCode ?? 'string',
          },
        },
      ],
      prices: [
        {
          type: 'Price',
          subType: resolvePriceData(clientObject),
          value: clientObject?.price,
        },
      ],
      amounts: [
        {
          type: 'StartLegCash',
          value: clientObject?.money ?? 0,
        },
      ],
    },
  ],
  partyIdentifiers: [
    {
      role: 'Entity',
      type: 'Internal',
      value: clientObject?.company ?? 'string',
    },
    {
      role: 'Counterparty',
      type: 'Internal',
      value: clientObject?.counterparty ?? 'string',
    },
  ],
  interestRates: [
    {
      benchmark: clientObject?.rateType === 'Floating' ? clientObject?.index : '',
      rateType: getRateType(clientObject?.rateType ?? ''),
      date: {
        type: 'TransactionDate',
        value: clientObject?.startDate ?? '',
      },
    },
  ],
  classifications: [
    {
      type: 'FinancingContractTerm',
      value: clientObject?.termType ?? 'string',
    },
  ],
  rates: [
    {
      type: 'Haircut',
      value: clientObject?.haircut ?? 0,
    },
  ],
  flags: [
    {
      type: 'CarryOverInterest',
      value: clientObject?.carryOverInterest ?? false,
    },
  ],
  lifecycleEvent: 'Rollover',
});
