import { uuid } from '@sfcm/framework';

export const translateToService = (clientObjectList: any[], userName: string): any => {
  if (clientObjectList?.length < 2) {
    return {
      uuid: uuid.generate(),
      userName,
      transactionType:
        clientObjectList.at(0)?.tradeType !== 'Reverse Repo'
          ? clientObjectList.at(0)?.tradeType
          : 'RevRepo',
      identifiers: [
        {
          type: 'InternalReference',
          value: clientObjectList.at(0)?.tradeId?.toString() ?? 'string',
        },
      ],
      interestRates: [
        {
          rateType: 'VariableInterestRate',
          value: clientObjectList.at(0)?.rateFee ?? 0,
          date: {
            type: 'TransactionDate',
            value: clientObjectList.at(0)?.startDate ?? 'string',
          },
        },
      ],
      partyIdentifiers: [
        {
          role: 'Entity',
          type: 'Internal',
          value: clientObjectList.at(0)?.company,
        },
      ],
      lifecycleEvent: 'RateChange',
    };
  } else {
    const batchUuid = uuid.generate();
    return {
      batchUuid,
      financingTradeLifecycleCommands: clientObjectList.map((x) => ({
        uuid: uuid.generate(),
        userName,
        transactionType: x?.tradeType !== 'Reverse Repo' ? x?.tradeType : 'RevRepo',
        identifiers: [
          {
            type: 'InternalReference',
            value: x?.tradeId?.toString() ?? 'string',
          },
        ],
        interestRates: [
          {
            rateType: 'VariableInterestRate',
            value: x?.rateFee ?? 0,
            date: {
              type: 'TransactionDate',
              value: x?.startDate ?? 'string',
            },
          },
        ],
        partyIdentifiers: [
          {
            role: 'Entity',
            type: 'Internal',
            value: x?.company,
          },
        ],
        lifecycleEvent: 'RateChange',
      })),
    };
  }
};
