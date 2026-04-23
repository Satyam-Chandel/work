import { ObjectSchema, yup } from '@sfcm/framework';
import { SF } from 'components/shared/sf-entities/const';

export interface IRePriceFormValidationProps {
  minDate: Date;
  maxDate?: Date;
}

export const getValidationSchema = (props: IRePriceFormValidationProps): ObjectSchema<any> => {
  return yup.object().shape({
    newPrice: yup
      .number()
      .required(),
    [SF.START_DATE]: yup
      .date()
      .required()
      .min(
        props.minDate,
        `Start Date cannot be before ${props.minDate}`
      )
      .max(
        props.maxDate || new Date('2100-12-31'),
        `Start Date cannot be after ${props.maxDate || '2100-12-31'}`
      ),
  });
};
