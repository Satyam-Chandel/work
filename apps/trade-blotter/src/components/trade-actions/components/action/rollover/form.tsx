import {
  date,
  SfFormikCheckBox,
  SfFormikDateInput,
  SfFormikDropdown,
  SfFormikNumericInput,
} from '@sfcm/framework';
import { IFormComponentProps } from 'components/shared/sf-form-manager';
import { useEffect, useMemo, useRef } from 'react';
import { ModalFormRow } from '../styled';
import { generateDateRange } from '../helper';

export interface IRolloverFormValues extends IFormComponentProps {
  isFloatingRateTrade: boolean;
}

export const RolloverForm = (props: IRolloverFormValues) => {
  const currentPrice = useRef<number>(0);
  const currentMoney = useRef<number>(0);
  const currentQuantity = useRef<number>(0);
  const moneyChangedByEffect = useRef(false);
  const priceChangedByEffect = useRef(false);
  const quantityChangedByEffect = useRef(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (rowRef.current) {
        const componentToFocus = rowRef.current?.querySelectorAll<HTMLInputElement>('input')?.[1];
        if (componentToFocus) {
          componentToFocus.focus();
        }
      }
    }, 500);
  }, []);

  //Price should default to price of trade with no rounding (based on selection price type)
  const getStartDateDisabledDates = useMemo(() => {
    const disabled: string[] = [];
    // Disable all dates before start date
    if (props.formik.values.startDate) {
      const dayBeforeStartDate = date.addDaysStr(props.formik.values.startDate, -1);
      disabled.push(...generateDateRange('2020-01-01', dayBeforeStartDate));
    }

    // Disable all dates after End Date (only if not Open term type)
    if (props.formik.values.endDate && props.formik.values.termType !== 'Open') {
      const dayAfterEndDate = date.addDaysStr(props.formik.values.endDate, 1);
      disabled.push(...generateDateRange(dayAfterEndDate, '2030-12-31'));
    }
    return disabled;
  }, [props.formik.values.startDate, props.formik.values.endDate, props.formik.values.termType]);

  const getEndDateDisabledDates = useMemo(() => {
    const disabled: string[] = [];
    // Disable all dates before start date
    if (props.formik.values.startDate) {
      const dayBeforeStartDate = date.addDaysStr(props.formik.values.startDate, -1);
      disabled.push(...generateDateRange('2020-01-01', dayBeforeStartDate));
    }
    return disabled;
  }, [props.formik.values.startDate]);

  useEffect(() => {
    const wasChangedByMoneyEffect = priceChangedByEffect.current;
    priceChangedByEffect.current = false;

    if (props.formik.values?.price !== currentPrice.current && !wasChangedByMoneyEffect) {
      quantityChangedByEffect.current = true;
      props.formik.setFieldValue('money', props.formik.values.price * props.formik.values.quantity);
      currentPrice.current = props.formik.values.price;
    }
  }, [props.formik?.values?.price]);

  useEffect(() => {
    const wasChangedByMoneyEffect = quantityChangedByEffect.current;
    quantityChangedByEffect.current = false;

    if (props.formik?.values?.quantity !== currentQuantity.current && !wasChangedByMoneyEffect) {
      priceChangedByEffect.current = true;
      props.formik.setFieldValue('money', props.formik.values.price * props.formik.values.quantity);
      currentQuantity.current = props.formik.values.quantity;
    }
  }, [props.formik?.values?.quantity]);

  useEffect(() => {
    const wasChangedByPriceOrQtyEffect = moneyChangedByEffect.current;
    moneyChangedByEffect.current = false;

    if (props.formik?.values?.money !== currentMoney.current && !wasChangedByPriceOrQtyEffect) {
      priceChangedByEffect.current = true;
      quantityChangedByEffect.current = true;
      props.formik.setFieldValue('quantity', props.formik.values.money / props.formik.values.price);
      currentMoney.current = props.formik.values.money;
    }
  }, [props.formik?.values?.money]);

  return (
    <>
      <ModalFormRow ref={rowRef}>
        <SfFormikDateInput
          id='date-return-start'
          fieldId='startDate'
          label='Start Date'
          formik={props.formik}
          colSpan={6}
          disabledDates={getStartDateDisabledDates}
          disableWeekends
          required
        />
        <SfFormikDateInput
          id='date-return-end'
          fieldId='endDate'
          label='End Date'
          formik={props.formik}
          colSpan={6}
          disableWeekends
          disabledDates={getEndDateDisabledDates}
          disabled={props.formik.values.termType === 'Open'}
          required={props.formik.values.termType !== 'Open'}
        />
      </ModalFormRow>
      <ModalFormRow>
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
        <SfFormikNumericInput
          id='num-return-price'
          fieldId='price'
          label='New Price'
          formik={props.formik}
          colSpan={6}
          precision={6}
          required
        />
      </ModalFormRow>
      <ModalFormRow>
        <SfFormikNumericInput id='num-qty' fieldId='quantity' formik={props.formik} colSpan={6} required />
        <SfFormikNumericInput fieldId='money' formik={props.formik} colSpan={6} precision={2} />
      </ModalFormRow>
      <ModalFormRow style={{ alignItems: 'center' }}>
        <SfFormikDropdown
          fieldId='termType'
          label='Term Type'
          options={[
            { label: 'Term', value: 'Term' },
            { label: 'Open', value: 'Open' },
          ]}
          autoSelectFirstOption={false}
          formik={props.formik}
          colSpan={5}
        />
        <SfFormikCheckBox
          fieldId='carryOverInterest'
          label='Carry Over Interest'
          formik={props.formik}
          colSpan={6}
        />
      </ModalFormRow>
      <ModalFormRow>
        <SfFormikNumericInput
          fieldId='rateFee'
          formik={props.formik}
          colSpan={6}
          precision={6}
          required
        />
        {props.isFloatingRateTrade && (
          <SfFormikNumericInput
            fieldId='spreadOffset'
            formik={props.formik}
            colSpan={6}
            precision={6}
            min={-99}
            max={99}
          />
        )}
      </ModalFormRow>
    </>
  );
};
