import { SfFormikNumericInput, dec, num } from '@sfcm/framework';
import { FormContainer, FormRow, IFormComponentProps } from '@sfcm/shared';
import { useEffect, useRef } from 'react';
import { FormField, SF, useTriangulationService } from '@sfcm/modules';
import Details from './Details';
import { getUpdateFieldLocks } from './rules';
import UpdateStaticDropdown from './UpdateStaticDropdown';

const TradeUpdateFormClassic = (props: IFormComponentProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFloatRate = useRef<boolean>(false);
  const lockConfig = getUpdateFieldLocks(props.formik.values);

  useTriangulationService(props.formik);

  useEffect(() => {
    // Focus the second dropdown in the first row after render (trade type field)
    setTimeout(() => {
      if (containerRef.current) {
        const secondDropdown =
          containerRef.current?.querySelectorAll<HTMLButtonElement>('button')?.[1];
        if (secondDropdown) {
          secondDropdown.focus();
        }
      }
    }, 500);
  }, []);

  useEffect(() => {
    const isBuyOrSellBack = props.formik.values[SF.IS_BUY_OR_SELL_BACK];
    const rateType = props.formik.values[SF.RATE_TYPE];

    isFloatRate.current = !isBuyOrSellBack && /^F|V/i.test(rateType);

    if (isBuyOrSellBack && props.formik.values[SF.RATE_TYPE] === 'Fixed') {
      props.formik.setFieldValue(SF.RATE_TYPE, 'FixedInterestRate');
    }

    if (!isFloatRate.current) {
      if (props.formik.values[SF.LATEST_INDEX_RATE]) {
        props.formik.setFieldValue(SF.LATEST_INDEX_RATE, null);
      }
      if (props.formik.values[SF.SPREAD_OFFSET]) {
        props.formik.setFieldValue(SF.SPREAD_OFFSET, null);
      }
      if (props.formik.values[SF.RATE_INDEX_CODE]) {
        props.formik.setFieldValue(SF.RATE_INDEX_CODE, '');
      }
    } else if (props.formik.values[SF.RATE_FEE]) {
      props.formik.setFieldValue(SF.RATE_FEE, null);
    }
  }, [props.formik.values[SF.RATE_TYPE], props.formik.values[SF.IS_BUY_OR_SELL_BACK]]);

  useEffect(() => {
    if (props.formik.values[SF.TERM_TYPE] !== 'Term') {
      props.formik.setFieldValue(SF.INTEREST, null);
      props.formik.setFieldValue(SF.END_DATE, null);
      props.formik.setFieldValue(SF.END_MONEY, null);
    }
  }, [props.formik.values[SF.TERM_TYPE]]);

  useEffect(() => {
    if (isFloatRate.current === true) {
      if (
        num.isNumber(props.formik.values[SF.LATEST_INDEX_RATE]) ||
        num.isNumber(props.formik.values[SF.SPREAD_OFFSET])
      ) {
        const spreadOffset = dec.multiply(props.formik.values[SF.SPREAD_OFFSET] ?? 0, 0.01, 6)
          .result;
        const rate = dec.add(props.formik.values[SF.LATEST_INDEX_RATE], spreadOffset, 6).result;
        props.formik.setFieldValue(SF.RATE_FEE, rate);
      }
    }
  }, [props.formik.values[SF.LATEST_INDEX_RATE], props.formik.values[SF.SPREAD_OFFSET]]);

  useEffect(() => {
    const normalizedTradeType = String(props.formik.values[SF.TRADE_TYPE] ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const isPledgeReceive = ['pledge', 'receive'].includes(normalizedTradeType);
    const isLoanBorrow = ['loan', 'borrow'].includes(normalizedTradeType);
    const isBankLoan = ['bankloan', 'bankborrow'].includes(normalizedTradeType);

    props.formik.setFieldValue(SF.IS_PLEDGE_RECEIVE, isPledgeReceive);
    props.formik.setFieldValue(SF.IS_LOAN_BORROW, isLoanBorrow);
    props.formik.setFieldValue(SF.IS_BANK_LOAN, isBankLoan);
  }, [props.formik.values[SF.TRADE_TYPE]]);

  const isMinFeeEntered =
    props.formik.values[SF.MIN_FEE] !== null &&
    props.formik.values[SF.MIN_FEE] !== undefined &&
    props.formik.values[SF.MIN_FEE] !== '';

  const isFeeEntered =
    props.formik.values[SF.FEE] !== null &&
    props.formik.values[SF.FEE] !== undefined &&
    props.formik.values[SF.FEE] !== '';

  useEffect(() => {
    if (lockConfig.lockLoanBorrowMode === 'rebate') {
      if (props.formik.values[SF.FEE] !== null && props.formik.values[SF.FEE] !== '') {
        props.formik.setFieldValue(SF.FEE, null);
      }
      return;
    }

    if (isMinFeeEntered && props.formik.values[SF.FEE] !== null) {
      props.formik.setFieldValue(SF.FEE, null);
    }
  }, [isMinFeeEntered, lockConfig.lockLoanBorrowMode]);

  useEffect(() => {
    if (lockConfig.lockLoanBorrowMode === 'fee') {
      if (props.formik.values[SF.MIN_FEE] !== null && props.formik.values[SF.MIN_FEE] !== '') {
        props.formik.setFieldValue(SF.MIN_FEE, null);
      }
      if (props.formik.values[SF.RATE_TYPE]) {
        props.formik.setFieldValue(SF.RATE_TYPE, '');
      }
      if (props.formik.values[SF.RATE_FEE] !== null && props.formik.values[SF.RATE_FEE] !== '') {
        props.formik.setFieldValue(SF.RATE_FEE, null);
      }
      return;
    }

    if (isFeeEntered) {
      if (props.formik.values[SF.MIN_FEE] !== null) {
        props.formik.setFieldValue(SF.MIN_FEE, null);
      }
      if (props.formik.values[SF.RATE_TYPE]) {
        props.formik.setFieldValue(SF.RATE_TYPE, '');
      }
      if (props.formik.values[SF.RATE_FEE] !== null) {
        props.formik.setFieldValue(SF.RATE_FEE, null);
      }
    }
  }, [isFeeEntered, lockConfig.lockLoanBorrowMode]);

  return (
    <>
      <FormContainer>
        <FormRow ref={containerRef}>
          <FormField.Book formik={props.formik} disabled={lockConfig.lockBook} />
          <FormField.TradeTypeUpdate formik={props.formik} disabled />
          <FormField.Client formik={props.formik} disabled={lockConfig.lockCounterparty} />
          {props.formik.values[SF.IS_BANK_LOAN] && (
            <FormField.Security formik={props.formik} disabled={lockConfig.lockSecurity} />
          )}
        </FormRow>

        <FormRow>
          {!props.formik.values[SF.IS_BANK_LOAN] && (
            <SfFormikNumericInput
              fieldId={SF.QUANTITY}
              formik={props.formik}
              min={0}
              max={500000000000}
              required
            />
          )}

          <UpdateStaticDropdown
            dropdownType='TermType'
            fieldId={SF.TERM_TYPE}
            formik={props.formik}
            disabled={props.formik.values?.[SF.IS_BUY_OR_SELL_BACK] === true}
            required
          />

          {props.formik.values[SF.IS_BUY_OR_SELL_BACK] === false && (
            <UpdateStaticDropdown
              dropdownType='RateType'
              fieldId={SF.RATE_TYPE}
              formik={props.formik}
              required={!isFeeEntered}
              disabled={isFeeEntered || lockConfig.lockLoanBorrowMode === 'fee'}
            />
          )}

          <SfFormikNumericInput
            fieldId={SF.RATE_FEE}
            formik={props.formik}
            precision={6}
            disabled={isFloatRate.current || isFeeEntered || lockConfig.lockLoanBorrowMode === 'fee'}
            required={!isFeeEntered}
          />
        </FormRow>

        {props.formik.values[SF.IS_LOAN_BORROW] && (
          <FormRow>
            <SfFormikNumericInput
              fieldId={SF.MIN_FEE}
              formik={props.formik}
              precision={6}
              disabled={isFeeEntered}
            />

            <SfFormikNumericInput
              fieldId={SF.FEE}
              formik={props.formik}
              precision={6}
              disabled={isMinFeeEntered}
            />
          </FormRow>
        )}

        {isFloatRate.current && (
          <FormRow>
            <FormField.RateIndex formik={props.formik} />

            <SfFormikNumericInput
              fieldId={SF.SPREAD_OFFSET}
              formik={props.formik}
              precision={6}
              min={-99}
              max={99}
            />
          </FormRow>
        )}
      </FormContainer>

      <br />

      <Details
        formik={props.formik}
        lockAgreement={lockConfig.lockAgreement}
        lockFxRate={lockConfig.lockFxRate}
        lockDeliveryInstructions={lockConfig.lockDeliveryInstructions}
      />
    </>
  );
};

export default TradeUpdateFormClassic;
