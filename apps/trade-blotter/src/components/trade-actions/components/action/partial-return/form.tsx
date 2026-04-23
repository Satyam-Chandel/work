import {
  SfFormikCheckBox,
  SfFormikDateInput,
  SfFormikDropdown,
  SfFormikNumericInput,
} from '@sfcm/framework';
import { IFormComponentProps } from 'components/shared/sf-form-manager';
import { ModalFormRow } from '../styled';
import { useEffect, useRef } from 'react';

export interface IPartialReturnFormValues extends IFormComponentProps {
  isTradeSbl: boolean;
}

export const PartialReturnForm = (props: IPartialReturnFormValues) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (rowRef.current) {
        const componentToFocus = rowRef.current?.querySelector<HTMLInputElement>('input');
        if (componentToFocus) {
          componentToFocus.focus();
        }
      }
    }, 500);
  }, []);

  return (
    <>
      <ModalFormRow ref={rowRef}>
        <SfFormikNumericInput
          id='num-return-qty'
          fieldId='quantity'
          label='Quantity to Return'
          formik={props.formik}
          colSpan={6}
          required
        />
        <SfFormikDateInput
          id='date-return-start'
          fieldId='startDate'
          label='Start Date'
          formik={props.formik}
          colSpan={6}
          disableWeekends
          required
        />
      </ModalFormRow>
      <ModalFormRow>
        <SfFormikNumericInput
          id='num-return-price'
          fieldId='price'
          label='New Price'
          formik={props.formik}
          colSpan={6}
          required
          disabled={props.isTradeSbl}
        />
        <SfFormikDropdown
          fieldId='priceType'
          label='Price Type'
          options={[
            { label: 'Clean Price', value: 'cleanPrice' },
            { label: 'Dirty Price', value: 'dirtyPrice' },
            { label: 'All In Price', value: 'allInPrice' },
          ]}
          autoSelectFirstOption={false}
          formik={props.formik}
          colSpan={6}
        />
      </ModalFormRow>
      <ModalFormRow style={{ paddingBottom: '8px' }}>
        {!props.isTradeSbl && (
          <SfFormikCheckBox
            fieldId='carryOverInterest'
            label='Carry Over Interest'
            formik={props.formik}
            colSpan={6}
          />
        )}
      </ModalFormRow>
    </>
  );
};
