import { ObjectSchema, yup } from '@sfcm/framework';
import { SF } from 'components/shared/sf-entities/const';

export interface IReRateFormValidationProps {
  minDate: Date;
  maxDate?: Date;
}

export const getValidationSchema = (props: IReRateFormValidationProps): ObjectSchema<any> => {
  return yup.object().shape({
    [SF.RATE_FEE]: yup
      .string()
      .matches(/^[+-]?(?:0|[1-9]\d?)(?:\.\d{1,6})?$/, 'Enter the value in this format')
      .required(),
    [SF.START_DATE]: yup
      .date()
      .required()
      .min(props.minDate, `Start Date cannot be before ${props.minDate}`)
      .max(
        props.maxDate || new Date('2100-12-31'),
        `Start Date cannot be after ${props.maxDate || '2100-12-31'}`
      ),
  });
};
