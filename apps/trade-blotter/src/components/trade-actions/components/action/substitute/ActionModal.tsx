import { usePostDataRequest, useAuthentication, useMessageService } from '@sfcm/shared';
import { useEffect, useMemo } from 'react';
import { IActionModalProps } from '../../../types';
import { substituteTrade } from './helper';
import { SubstituteForm } from './form';
import { useFormManager } from 'components/shared/sf-form-manager';
import { getValidationSchema } from './validation';
import { str } from '@sfcm/framework';
import { SF } from 'components/shared/sf-entities/const';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Substitute');
  const { user } = useAuthentication();

  const initialValues = useMemo(() => {
    return {
      [SF.ISIN]: '',
      [SF.INSTRUMENT_ID]: '',
      [SF.QUANTITY]: '',
      price: '',
      priceType: 'allInPrice',
      startDate: props.systemConfig?.currentBusinessDate,
      carryOverInterest: false,
      [SF.MONEY]: props.selectedRows?.[0]?.money ?? 0,
    };
  }, [props.selectedRows]);

  const validationSchema = useMemo(() => {
    return getValidationSchema({
      minDate: props.selectedRows?.[0]?.startDate,
      maxDate: props.selectedRows?.[0]?.endDate,
    });
  }, [props.selectedRows]);

  const { formik } = useFormManager({
    initialValues,
    validationSchema,
    handleSubmit: (values) => submitForm(values),
    forceValidation: true,
  });

  useEffect(() => {
    props.submitAction(submit);
  }, [props.submitAction]);

  useEffect(() => {
    console.log('Formik.values:', formik.values);
  }, [formik.values]);

  useEffect(() => {
    props.onSubmitEnabled?.(formik.isValid && !formik.isValidating);
  }, [formik.isValid, formik.isValidating, props]);

  const submit = () => {
    console.log('Submit function called for Substitute action with selected rows:', props.selectedRows);
    formik.submitForm();
  };

  const submitForm = (values: any) => {
    const newTrade = {
      ...props.selectedRows?.[0],
      startDate: values.startDate,
      quantity: values.quantity,
      money: props.selectedRows?.[0]?.money,
      priceType: values.priceType,
      price: values.price,
      carryoverInterest: values.carryoverInterest,
      isin: values.isin,
      instrumentId: values.instrumentId,
    };

    substituteTrade(requestData, user, sendMessage, newTrade)
      .then((result) => {
        if (result.ok && !str.isEmpty(result.uuid)) {
          props.onActionComplete?.(result.uuid, 'substitute');
          props.onClose();
        } else {
          // Handle error case
        }
      })
      .finally(() => {
        props.onClose();
      });
  };

  return (
    <SubstituteForm
      startDate={props.selectedRows?.[0]?.startDate}
      endDate={props.selectedRows?.[0]?.endDate}
      termType={props.selectedRows?.[0]?.termType}
      formik={formik}
    />
  );
};

export default ActionModal;
