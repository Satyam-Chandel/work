import { date, SfFormikDateInput, SfFormikInput } from '@sfcm/framework';
import { IFormComponentProps } from 'components/shared/sf-form-manager';
import { ModalFormRow } from '../styled';
import { generateDateRange } from '../helper';
import { useEffect, useMemo, useRef } from 'react';

export interface IReRateFormValues extends IFormComponentProps {
  startDate: any;
  endDate: any;
}

export const RateChangeForm = (props: IReRateFormValues) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (rowRef.current) {
        const componentToFocus = rowRef.current?.querySelectorAll<HTMLInputElement>('input')?.[0];
        if (componentToFocus) {
          componentToFocus.focus();
        }
      }
    }, 500);
  }, []);

  const getStartDateDisabledDates = useMemo(() => {
    const disabled: string[] = [];
    // Disable all dates before start date
    if (props.formik.values.startDate || props.startDate) {
      const dayBeforeStartDate = date.addDaysStr(props.startDate, -1);
      disabled.push(...generateDateRange('2020-01-01', dayBeforeStartDate));
    }

    // Disable all dates after End Date (only if not Open term type)
    if (props.endDate !== undefined) {
      const dayAfterEndDate = date.addDaysStr(props.endDate, 1);
      disabled.push(...generateDateRange(dayAfterEndDate, '2030-12-31'));
    }
    return disabled;
  }, []);

  return (
    <ModalFormRow ref={rowRef}>
      <SfFormikInput
        id='text-rc-new-rate'
        fieldId='rateFee'
        label='New Rate/Fee'
        formik={props.formik}
        colSpan={6}
        required
      />
      <SfFormikDateInput
        id='date-rc-start-date'
        fieldId='startDate'
        label='Start Date'
        formik={props.formik}
        colSpan={6}
        disabledDates={getStartDateDisabledDates}
        disableWeekends
        required
      />
    </ModalFormRow>
  );
};
