import { ObjectSchema, yup } from '@sfcm/framework';
import { SF } from 'components/shared/sf-entities/const';

export interface ISubstituteFormValidationProps {
  minDate?: Date | string;
  maxDate?: Date | string;
}

export const getValidationSchema = (props: ISubstituteFormValidationProps): ObjectSchema<any> => {
  return yup.object().shape({
    [SF.ISIN]: yup.string().required(),
    [SF.QUANTITY]: yup
      .number()
      .required()
      .integer('Quantity ust be a whole number')
      .moreThan(0),
    [SF.START_DATE]: yup
      .date()
      .required()
      .min(props.minDate, `start Date cannot be before ${props.minDate}`)
      .max(
        props.maxDate || new Date('2100-12-31'),
        `start Date cannot be after ${props.maxDate || '2100-12-31'}`
      ),
  });
};
