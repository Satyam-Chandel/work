export const translateToClient = (settlements: any): any => ({
    ...serviceObject,
});

export const translateToService = (clientObjectList: any): any => ({
    tradeIds: clientObjectList.map((clientObject: any) => clientObject.tradeId),
});