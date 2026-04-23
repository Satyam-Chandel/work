import { uuid } from '@sfcm/framework';

const resolvePriceData = (clientObject: any) => {
  const selectedPriceType = clientObject?.priceType || 'allInPrice';

  if (selectedPriceType === 'CleanPrice') {
    return 'Clean';
  } else if (selectedPriceType === 'DirtyPrice') {
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
  transactionType: clientObject?.tradeType === 'Repo' ? 'Repo' : 'RevRepo',
  identifiers: [
    {
      type: 'InternalReference',
      value: clientObject?.tradeId?.toString() ?? 'string',
    },
  ],
  dates: [
    {
      type: 'EffectiveDate',
      value: clientObject?.startDate ?? 'string',
    },
  ],
  securities: [
    {
      quantities: [
        {
          type: 'TransactionQuantity',
          value: clientObject?.quantity ?? 0,
        },
      ],
      prices: [
        {
          type: 'Price',
          subType: resolvePriceData(clientObject),
          value: clientObject?.price ?? 0,
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
  rates: [
    {
      type: 'Haircut',
      value: clientObject?.haircut ?? 0,
    },
  ],
  interestRates: [
    {
      benchmark: clientObject?.index,
      rateType: getRateType(clientObject?.rateType ?? ''),
      spread: clientObject?.rateType === 'Floating' ? clientObject?.spreadOffset : '',
      dayCount: clientObject?.dayCount,
      value: clientObject?.rateFee,
      date: {
        type: 'TransactionDate',
        value: clientObject?.startDate ?? 'string',
      },
    },
  ],
  lifecycleEvent: 'RePrice',
});
