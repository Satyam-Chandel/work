export const translateToService = (trade: any) => ({
...serviceObject
});

export const translateToService = (clientObject: any): any => ({
    transactionTypeEnum: clientObject.tradeType,
    entityCode: clientObject.company,
    tradeId: clientObject.tradeId,
});