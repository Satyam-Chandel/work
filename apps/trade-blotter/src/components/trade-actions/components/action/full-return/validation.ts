import { ObjectSchema, yup } from '@sfcm/framework';
import { SF } from 'components/shared/sf-entities/const';

export interface IFullReturnFormValidationProps {
  minDate?: Date;
}

export const getValidationSchema = (props: IFullReturnFormValidationProps): ObjectSchema<any> => {
  return yup.object().shape({
    [SF.RETURN_DATE]: yup
      .date()
      .required()
      .min(
        props.minDate || new Date('1900-01-01'),
        `Return Date cannot be before ${props.minDate || '1900-01-01'}`
      ),
  });
};
