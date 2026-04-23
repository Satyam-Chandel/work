import { date } from '@sfcm/framework';

export const prepareErrorMessageFromFailedTrades = (failedTrades: any[]): string => {
  let errorText = '';
  failedTrades?.forEach((failedTrade) => {
    errorText = errorText.concat(
      `Trade ID: ${failedTrade?.financingTradeLifeCycleCommandResponseEntity?.identifiers?.[0]?.value} : ${
        failedTrade?.financingTradeLifeCycleCommandResponseEntity?.errorResponse?.errorDescription
      }\n`
    );
  });
  return errorText;
};

export const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let current = startDate;

  while (current <= endDate) {
    dates.push(current);
    current = date.addDaysStr(current, 1);
  }

  return dates;
};

export const getMessageUponActionCompletion = (actionType: string, timestamp: string) => {
  switch (actionType) {
    case 'cancel':
      return {
        successTitle: 'Successful',
        successBody: `Successfully Cancelled Deals ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to Cancel trade',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    case 'full-return':
      return {
        successTitle: 'Successful',
        successBody: `Successfully Closed Deal ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to Return Deal',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    case 'partial-return':
      return {
        successTitle: 'Successful',
        successBody: `Successfully Partial Returned Deal ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to Partial Return Deal',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    case 're-price':
      return {
        successTitle: 'Successful',
        successBody: `Successfully Re-priced Deals ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to Re-price Deals',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    case 're-rate':
      return {
        successTitle: 'Successful',
        successBody: `Successfully Re-rated Deals ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to Re-rate Deals',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    case 'rollover':
      return {
        successTitle: 'Successful',
        successBody: `Successfully Rollover Deal ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to Rollover Deal',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    case 'settle-delivery':
      return {
        successTitle: 'Successful',
        successBody: `Successfully Settled Delivery leg Deals ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to settle Delivery leg Deals',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    case 'substitute':
      return {
        successTitle: 'Successful',
        successBody: `Substitution has been processed successfully ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to substitute trade',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    case 'unsettle':
      return {
        successTitle: 'Successful',
        successBody: `Successfully unsettled the trade ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to unsettle trade',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    case 'verify':
      return {
        successTitle: 'Successful',
        successBody: `Successfully Verified Deals ${timestamp}`,
        errorTitle: 'Failed',
        errorMessageBody: 'Failed to Verify Deals',
        successSubmitButtonText: 'Dismiss',
        errorSubmitButtonText: 'Dismiss',
      };
    default:
      break;
  }
};
