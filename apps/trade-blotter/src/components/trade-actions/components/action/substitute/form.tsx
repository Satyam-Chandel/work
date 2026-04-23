import {
  date,
  SfForm1CheckBox,
  SfForm1DateInput,
  SfForm1Dropdown,
  SfForm1NumericInput,
} from '@sfcm/framework';
import { FormField } from '@sfcm/modules';
import { SF } from 'components/shared/sf-entities/const';
import { IFormComponentProps } from 'components/shared/sf-form-manager';
import { useEffect, useMemo, useRef } from 'react';
import { ModalFormRow } from '../styled';
import { generateDateRange } from '../helper';

export interface ISubstituteFormValues extends IFormComponentProps {
  startDate: any;
  endDate: any;
  termType: any;
}

export const SubstituteForm = (props: ISubstituteFormValues) => {
  const currentPrice = useRef<number>(0);
  const currentQuantity = useRef<number>(0);
  const quantityChangedByEffectRef = useRef(false);
  const priceChangedByEffectRef = useRef(false);
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

  useEffect(() => {
    if (props.formik?.values?.priceType === 'dirtyPrice') {
      props.formik.setFieldValue('price', props.formik?.values?.dirtyPrice || '');
    } else if (props.formik?.values?.priceType === 'cleanPrice') {
      props.formik.setFieldValue('price', props.formik?.values?.cleanPrice || '');
    } else {
      props.formik.setFieldValue('price', props.formik?.values?.dirtyPrice || '');
    }
  }, [props.formik?.values?.isin, props.formik?.values?.priceType]);

  useEffect(() => {
    const wasChangedByQuantityEffect = priceChangedByEffectRef.current;
    priceChangedByEffectRef.current = false;

    if (currentPrice.current !== props.formik?.values.price && !wasChangedByQuantityEffect) {
      quantityChangedByEffectRef.current = true;
      props.formik?.setFieldValue(
        'quantity',
        props.formik?.values?.money && props.formik?.values?.price
          ? Math.round(props.formik.values.money / props.formik.values.price)
          : ''
      );
      currentPrice.current = props.formik?.values?.price;
    }
  }, [props.formik?.values?.price]);

  useEffect(() => {
    const wasChangedByPriceEffect = quantityChangedByEffectRef.current;
    quantityChangedByEffectRef.current = false;

    if (currentQuantity.current !== props.formik?.values.quantity && !wasChangedByPriceEffect) {
      priceChangedByEffectRef.current = true;
      props.formik?.setFieldValue(
        'price',
        props.formik?.values?.money && props.formik?.values?.quantity
          ? Number((props.formik.values.money / props.formik.values.quantity).toFixed(6))
          : ''
      );
      currentQuantity.current = props.formik?.values?.quantity;
    }
  }, [props.formik?.values?.quantity]);

  return (
    <>
      <ModalFormRow ref={rowRef}>
        <FormField.Security formik={props.formik} colSpan={6} />
        <SfForm1NumericInput
          fieldId='quantity'
          label='Quantity'
          formik={props.formik}
          min={0}
          max={50000000000}
          precision={0}
          colSpan={6}
          required
        />
      </ModalFormRow>

      <ModalFormRow>
        <SfForm1Dropdown
          fieldId={'priceType'}
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
        <SfForm1NumericInput
          fieldId='price'
          label='Price'
          formik={props.formik}
          precision={6}
          colSpan={6}
        />
      </ModalFormRow>

      <ModalFormRow style={{ alignItems: 'center' }}>
        <SfForm1DateInput
          id='date-subs-start-date'
          fieldId='startDate'
          label='Start Date'
          formik={props.formik}
          colSpan={6}
          disabledDates={getStartDateDisabledDates}
          disableWeekends
          required
        />
        <SfForm1CheckBox
          fieldId='carryOverInterest'
          label='Carry Over Interest'
          formik={props.formik}
          colSpan={6}
        />
      </ModalFormRow>
      <ModalFormRow>
        <SfForm1NumericInput
          fieldId={SF.MONEY}
          formik={props.formik}
          precision={2}
          disabled
          colSpan={6}
        />
      </ModalFormRow>
    </>
  );
};
