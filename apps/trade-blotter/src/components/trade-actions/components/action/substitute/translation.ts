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
          instrumentIdentifier: {
            type: 'CUSIP',
            value: clientObject?.isin ?? 'string',
          },
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
  flags: [
    {
      type: 'CarryOverIntrest',
      value: clientObject?.carryOverInterest ?? false,
    },
  ],
  lifeCycleEvent: 'Substitute',
});
