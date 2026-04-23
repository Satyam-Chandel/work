import { ObjectSchema, yup } from '@sfcm/framework';
import { SF } from 'components/shared/sf-entities/const';

export const getValidationSchema = (): ObjectSchema<any> => {
  return yup.object().shape({
    [SF.START_DATE]: yup.date().required('Start Date is required'),
    price: yup.number().required('Price is required'),
    quantity: yup.number().required('Quantity is required'),
    money: yup.number().required('Money is Required'),
    rateFee: yup.number().required('Rate Fee is Required'),
    endDate: yup.date().required('End date is required'),
  });
};
