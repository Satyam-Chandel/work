
import {
  date,
  SfFormikCheckBox,
  SfFormikDateInput,
  SfFormikDropdown,
  SfFormikNumericInput,
} from '@sfcm/framework';
import { IFormComponentProps } from 'components/shared/sf-form-manager';
import { ModalFormRow } from '../styled';
import { generateDateRange } from '../helper';
import { useEffect, useMemo, useRef } from 'react';

export interface IRepriceFormValues extends IFormComponentProps {
  startDate: any;
  endDate: any;
  termType: any;
}

export const PriceChangeForm = (props: IRepriceFormValues) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      const componentToFocus = rowRef.current?.querySelector<HTMLInputElement>('input');
      if (componentToFocus) {
        componentToFocus.focus();
      }
    }, 500);
  }, []);

  const getStartDateDisabledDates = useMemo(() => {
    const disabled: string[] = [];
    // Disable all dates before start date
    if (props.formik.values.startDate) {
      const dayBeforeStartDate = date.addDaysStr(props.startDate, -1);
      disabled.push(...generateDateRange('2020-01-01', dayBeforeStartDate));
    }

    // Disable all dates after End Date (only if not Open term type)
    if (props.endDate && props.termType !== 'Open') {
      const dayAfterEndDate = date.addDaysStr(props.endDate, 1);
      disabled.push(...generateDateRange(dayAfterEndDate, '2030-12-31'));
    }
    return disabled;
  }, []);

  return (
    <>
      <ModalFormRow ref={rowRef}>
        <SfFormikNumericInput
          id='num-new-price'
          fieldId='newPrice'
          label='New Price'
          formik={props.formik}
          colSpan={6}
          precision={6}
          required
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
      <ModalFormRow style={{ alignItems: 'center' }}>
        <SfFormikDateInput
          id='date-new-price'
          fieldId='startDate'
          label='Start Date'
          formik={props.formik}
          colSpan={6}
          disabledDates={getStartDateDisabledDates}
          disableWeekends
          required
        />
        <SfFormikCheckBox
          fieldId='carryOverInterest'
          label='Carry Over Interest'
          formik={props.formik}
          colSpan={6}
        />
      </ModalFormRow>
      <ModalFormRow>
        <SfFormikDropdown
          id='drop-clearance'
          fieldId='clearance'
          formik={props.formik}
          colSpan={6}
          disabled
        />
      </ModalFormRow>
    </>
  );
};
