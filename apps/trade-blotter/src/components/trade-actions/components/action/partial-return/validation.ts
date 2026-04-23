import { ObjectSchema, yup } from '@sfcm/framework';
import { SF } from 'components/shared/sf-entities/const';

export interface IPartialReturnFormValidationProps {
  minDate: Date;
  maxDate?: Date;
  maxQuantityToReturn: number;
  isTradeSbl: boolean;
}

export const getValidationSchema = (
  props: IPartialReturnFormValidationProps
): ObjectSchema<any> => {
  return yup.object().shape({
    [SF.START_DATE]: yup
      .date()
      .required()
      .min(props.minDate, `Start Date cannot be before ${props.minDate}`)
      .max(
        props.maxDate || new Date('2100-12-31'),
        `Start Date cannot be after ${props.maxDate || '2100-12-31'}`
      ),
    quantity: yup
      .number()
      .required()
      .min(1, 'Quantity to Return must be at least 1')
      .max(
        props.maxQuantityToReturn - 1,
        `Quantity to Return cannot exceed ${props.maxQuantityToReturn}`
      ),
    price: !props.isTradeSbl
      ? yup.number().required('New Price is required for non-SBL trades')
      : yup.number().notRequired(),
  });
};
