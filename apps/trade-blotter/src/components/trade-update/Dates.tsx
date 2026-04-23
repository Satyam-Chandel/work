import { SfFormikDateInput, date } from '@sfcm/framework';
import { FormRow } from '@sfcm/shared';
import { SF } from '@sfcm/modules';
import { useEffect, useMemo, useRef } from 'react';
import { ITradeUpdateFormComponentProps } from './types';

const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let current = startDate;

  while (current <= endDate) {
    dates.push(current);
    current = date.addDaysStr(current, 1);
  }

  return dates;
};

export const DateFields = (props: ITradeUpdateFormComponentProps): JSX.Element => {
  const isOpenTermType = useRef<boolean>(false);
  const isTermTermType = useRef<boolean>(false);

  useEffect(() => {
    isOpenTermType.current = props.formik.values.termType === 'Open';
    isTermTermType.current = props.formik.values.termType === 'Term';
    // Clear endDate if term Type is Open
    if (isOpenTermType.current && props.formik.values.endDate) {
      props.formik.setFieldValue('endDate', '');
    }
  }, [props.formik.values.termType]);

  // Build disabled dates for Start Date
  const getStartDateDisabledDates = useMemo(() => {
    const disabled: string[] = [];

    // Disable all dates before Trade Date
    if (props.formik.values.tradeDate) {
      const dayBeforeTradeDate = date.addDaysStr(props.formik.values.tradeDate, -1);
      disabled.push(...generateDateRange('2020-01-01', dayBeforeTradeDate));
    }

    // Disable all dates after End Date (only if not Open term type)
    if (props.formik.values.endDate && props.formik.values.termType !== 'Open') {
      const dayAfterEndDate = date.addDaysStr(props.formik.values.endDate, 1);
      disabled.push(...generateDateRange(dayAfterEndDate, '2030-12-31'));
    }

    return disabled;
  }, [props.formik.values.tradeDate, props.formik.values.endDate, props.formik.values.termType]);

  // Build disabled dates for End Date
  const getEndDateDisabledDates = useMemo(() => {
    const disabled: string[] = [];

    // Disable all dates before Start Date
    if (props.formik.values.startDate) {
      const dayBeforeStartDate = date.addDaysStr(props.formik.values.startDate, -1);
      disabled.push(...generateDateRange('2020-01-01', dayBeforeStartDate));
    }

    return disabled;
  }, [props.formik.values.startDate]);

  return (
    <FormRow>
      <SfFormikDateInput
        fieldId={SF.TRADE_DATE}
        label='Trade Date'
        formik={props.formik}
        disableWeekends
        disabledDates={['2026-01-01', '2026-01-15', '2026-01-26']} //We can change this later with holidays service
        required
        tabIndex={-1}
      />

      <SfFormikDateInput
        fieldId={SF.START_DATE}
        label='Start/Settle Date'
        formik={props.formik}
        disableWeekends
        disabledDates={getStartDateDisabledDates}
        required
      />

      {(isTermTermType.current || props.formik.values[SF.IS_PLEDGE_RECEIVE] === true) && (
        <SfFormikDateInput
          fieldId={SF.END_DATE}
          formik={props.formik}
          disableWeekends
          disabledDates={getEndDateDisabledDates}
          required={['BuySellBack', 'SellBuyBack'].includes(props.formik.values[SF.TRADE_TYPE])}
        />
      )}
    </FormRow>
  );
};
