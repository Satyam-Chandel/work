import { uuid } from '@sfcm/framework';

export const translateToService = (clientObjectList: any[]): any => {
  if (clientObjectList.length < 2) {
    return {
      uuid: uuid.generate(),
      status: 'Settled',
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
      lifecycleEvent: 'StatusChange',
    };
  } else {
    const batchUuid = uuid.generate();
    return {
      batchUuid,
      financingTradeLifecycleCommands: clientObjectList.map((x) => ({
        uuid: uuid.generate(),
        batchUuid,
        status: 'Settled',
        transactionType: x?.tradeType !== 'Reverse Repo' ? x?.tradeType : 'RevRepo',
        identifiers: [
          {
            type: 'InternalReference',
            value: x?.tradeId?.toString() ?? 'string',
          },
        ],
        lifecycleEvent: 'StatusChange',
      })),
    };
  }
};
