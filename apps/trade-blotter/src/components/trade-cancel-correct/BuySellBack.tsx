import { SfFormikNumericInput } from '@sfcm/framework';
import { FormRow } from '@sfcm/shared';
import { useEffect } from 'react';
import { SF, FormField } from '@sfcm/modules';
import { ITradeUpdateFormComponentProps } from './types';

const BuySellBack = (props: ITradeUpdateFormComponentProps): JSX.Element | null => {
  useEffect(() => {
    const tradeType = String(props.formik.values[SF.TRADE_TYPE] ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const isBuySellBack = ['buysellback', 'sellbuyback'].includes(tradeType);

    props.formik.setValues((x: any) => ({
      ...x,
      [SF.IS_BUY_OR_SELL_BACK]: isBuySellBack,
      [SF.COUPON_METHOD]: isBuySellBack ? x[SF.COUPON_METHOD] : '',
      [SF.COUPON_COMPENSATION]: isBuySellBack ? x[SF.COUPON_COMPENSATION] : '',
      [SF.TERM_TYPE]: isBuySellBack ? 'Term' : x[SF.TERM_TYPE],
    }));
  }, [props.formik.values[SF.TRADE_TYPE]]);

  useEffect(() => {
    if (props.formik.values[SF.COUPON_COMPENSATION] !== 0) {
      if (props.formik.values[SF.COUPON_METHOD] === 'P') {
        props.formik.setFieldValue(SF.COUPON_COMPENSATION, 0);
      }
    }
  }, [
    props.formik.values[SF.COUPON_METHOD],
    props.formik.values[SF.COUPON_COMPENSATION],
    props.formik.values[SF.IS_BUY_OR_SELL_BACK],
  ]);

  return props.formik.values?.[SF.IS_BUY_OR_SELL_BACK] ? (
    <FormRow>
      <FormField.StaticDropdown
        dropdownType='CouponMethod'
        fieldId={SF.COUPON_METHOD}
        formik={props.formik}
        required={['BuySellBack', 'SellBuyBack'].includes(props.formik.values[SF.TRADE_TYPE])}
      />

      <SfFormikNumericInput
        fieldId={SF.COUPON_COMPENSATION}
        formik={props.formik}
        min={0}
        precision={6}
        disabled={props.formik.values[SF.COUPON_METHOD] === 'P'}
      />
    </FormRow>
  ) : null;
};

export default BuySellBack;
