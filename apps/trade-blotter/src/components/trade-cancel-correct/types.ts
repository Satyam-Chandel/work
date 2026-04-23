import { IFormComponentProps } from '@sfcm/shared';

export interface ITradeUpdateComponentProps extends IFormComponentProps {
    lockAgreement?: boolean;
    lockFixrate?: boolean;
    lockDeliveryInstructions?: boolean;
    lockLoanBorrowMode?: 'rebate' | 'fee' | null;
}