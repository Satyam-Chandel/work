import { date, num, SfButton, SfFormikCheckBox, SfFormikNumericInput } from '@sfcm/framework';
import { FormCol, FormHalfCol, FormRow } from '@sfcm/shared';
import { useEffect, useState } from 'react';
import { FormField, SF } from '@sfcm/modules';
import { CalcMoneyButtonContainer } from './styled';
import { ITradeUpdateFormComponentProps } from './types';

const Price = (props: ITradeUpdateFormComponentProps): JSX.Element => {
  const [isManualCalcEnabled, setIsManualCalcEnabled] = useState(false);

  useEffect(() => {
    if (props.formik.values[SF.MANUAL_CALCULATION] === true) {
      if (
        props.formik.values[SF.QUANTITY] > 0 &&
        props.formik.values[SF.HAIRCUT] > 0 &&
        num.isNumber(props.formik.values[SF.RATE_FEE]) &&
        num.toNumber(props.formik.values[SF.RATE_FEE]) !== 0 &&
        props.formik.values[SF.CLEAN_PRICE] > 0
      ) {
        setIsManualCalcEnabled(true);
      } else {
        setIsManualCalcEnabled(false);
      }
    }
  }, [props.formik.values]);

  return (
    <>
      {!props.formik.values[SF.IS_BANK_LOAN] && (
        <FormRow>
          <SfFormikNumericInput fieldId={SF.CLEAN_PRICE} formik={props.formik} precision={6} />

          <SfFormikNumericInput fieldId={SF.DIRTY_PRICE} formik={props.formik} precision={6} />

          <FormCol $colSpan={3}>
            <FormHalfCol $position='left'>
              <FormField.Currency formik={props.formik} colSpan={false} />
            </FormHalfCol>
            <FormHalfCol $position='right'>
              <SfFormikNumericInput
                fieldId={SF.FX_RATE}
                label='FX Rate'
                formik={props.formik}
                colSpan={false}
                precision={6}
                disabled={
                  (props.formik?.values[SF.CURRENCY] ?? '') ===
                  (props.formik?.values[SF.INSTRUMENT_CURRENCY] ?? '')
                }
              />
            </FormHalfCol>
          </FormCol>

          {props.formik.values[SF.IS_LOAN_BORROW] && (
            <SfFormikNumericInput
              fieldId={SF.HAIRCUT}
              formik={props.formik}
              colSpan={3}
              precision={6}
              min={0}
            />
          )}

          {props.formik.values[SF.IS_LOAN_BORROW] && (
            <SfFormikNumericInput
              fieldId={SF.MARGIN}
              formik={props.formik}
              colSpan={3}
              precision={2}
              min={1}
              max={200}
            />
          )}
        </FormRow>
      )}

      <FormRow>
        {props.formik.values[SF.IS_BANK_LOAN] && (
          <FormField.Currency formik={props.formik} colSpan={2} required />
        )}
        <SfFormikNumericInput
          fieldId={SF.MONEY}
          formik={props.formik}
          precision={2}
          required={props.formik.values[SF.IS_BANK_LOAN]}
        />

        {props.formik.values[SF.IS_LOAN_BORROW] && (
          <SfFormikNumericInput fieldId={SF.END_MONEY} formik={props.formik} precision={2} disabled />
        )}

        <FormCol $colSpan={3}>
          <FormHalfCol $position='left'>
            <SfFormikNumericInput
              fieldId={SF.INTEREST}
              formik={props.formik}
              colSpan={false}
              precision={2}
              disabled
            />
          </FormHalfCol>
          <FormHalfCol $position='right'>
            <SfFormikNumericInput
              fieldId={SF.ALL_IN_PRICE}
              formik={props.formik}
              colSpan={false}
              precision={6}
              disabled={props.formik.values[SF.IS_BANK_LOAN]}
            />
          </FormHalfCol>
        </FormCol>

        {props.formik.values[SF.IS_BANK_LOAN] && (
          <FormCol $colSpan={3} style={{ alignItems: 'end' }}>
            <FormHalfCol $position='left' style={{ marginBottom: '8px' }}>
              <SfFormikCheckBox
                fieldId={SF.MANUAL_CALCULATION}
                label='Manual Calc'
                formik={props.formik}
                colSpan={false}
              />
            </FormHalfCol>
            <FormHalfCol $position='right'>
              <CalcMoneyButtonContainer>
                {props.formik?.values?.manualCalculation === true && (
                  <SfButton
                    id='btn-trade-update-calculate'
                    label='Calculate'
                    variant='tertiary'
                    toolTip='Calculate requires Quantity, Haircut, Rate and Price'
                    disabled={!isManualCalcEnabled}
                    onClick={() => {
                      props.formik.setFieldValue(SF.RUN_MANUAL_CALCULATION, date.nowStrNsec());
                    }}
                  />
                )}
              </CalcMoneyButtonContainer>
            </FormHalfCol>
          </FormCol>
        )}
      </FormRow>
    </>
  );
};

export default Price;
