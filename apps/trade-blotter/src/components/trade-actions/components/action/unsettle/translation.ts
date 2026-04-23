import { uuid } from '@sfcm/framework';

export const translateToService = (clientObjectList: any[]): any => {
  if (clientObjectList?.length < 2) {
    return [
      {
        uuid: uuid.generate(),
        status: 'UnSettled',
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
        lifeCycleEvent: 'StatusChange',
      },
    ];
  }
};
