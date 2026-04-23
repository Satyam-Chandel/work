import { uuid } from '@sfcm/framework';

export const translateToService = (clientObject: any, userName: string): any => ({
  uuid: clientObject?.uuid ?? uuid.generate(),
  userName,
  transactionType:
    clientObject?.tradeType !== 'Reverse Repo'
      ? clientObject?.tradeType
      : 'RevRepo',
  identifiers: [
    {
      type: 'InternalReference',
      value: clientObject?.tradeId?.toString() ?? 'string',
    },
  ],
  dates: [
    {
      type: 'TransactionDate',
      value: clientObject?.returnDate ?? '',
    },
    {
      type: 'ContractualStartDate',
      value: clientObject?.returnDate ?? '',
    },
    {
      type: 'EffectiveDate',
      value: clientObject?.returnDate ?? '',
    },
    {
      type: 'AgreedSettlementDate',
      value: clientObject?.returnDate ?? '',
    },
    {
      type: 'InputDate',
      value: clientObject?.returnDate ?? '',
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
          subType: 'Dirty',
          value: clientObject?.dirtyPrice ?? 0,
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
  lifecycleEvent: 'FullReturn',
});
