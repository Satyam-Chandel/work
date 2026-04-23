import { usePostDataRequest, useAuthentication, useMessageService } from '@sfcm/shared';
import { useEffect, useMemo } from 'react';
import { IActionModalProps } from './../../../../types';
import { rolloverTrade } from './helper';
import { RolloverForm } from './form';
import { useFormManager } from 'components/shared/sf-form-manager';
import { getValidationSchema } from './validation';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Re-price');
  const { user } = useAuthentication();

  const initialValues = useMemo(() => {
    return {
      startDate: props.selectedRows?.[0]?.endDate,
      price:
        props.selectedRows?.[0]?.allInPrice ??
        (props.selectedRows?.[0]?.dirtyPrice ?? 0) / (props.selectedRows?.[0]?.haircut ?? 1),
      quantity: Math.abs(props.selectedRows?.[0]?.quantity ?? 0),
      money: props.selectedRows?.[0]?.money,
      rateFee: props.selectedRows?.[0]?.rateFee,
      spreadOffset: props.selectedRows?.[0]?.spreadOffset,
      termType: props.selectedRows?.[0]?.termType,
      carryOverInterest: false,
      priceType: 'allInPrice',
    };
  }, [props.selectedRows]);

  const validationSchema = useMemo(() => {
    return getValidationSchema();
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
    props.onSubmitEnabled?.(formik.isValid && !formik.isValidating);
  }, [formik.isValid, formik.isValidating, props]);

  useEffect(() => {
    console.log('Formik values changed:', formik.values);
  }, [formik.values, formik.isValidating]);

  const submit = () => {
    console.log(
      'Submit function called for Partial Return action with selected rows:',
      props.selectedRows
    );

    formik.submitForm();
  };

  const submitForm = (values: any) => {
    const modifiedRow = {
      ...props.selectedRows?.[0],
      startDate: values.startDate,
      priceType: values.priceType,
      price: values.price,
      carryOverInterest: values.carryOverInterest,
      quantity: values.quantity,
      endDate: values.endDate,
      rateFee: values.rateFee,
      spreadOffset: values.spreadOffset,
      termType: values.termType,
      money: values.money,
    };

    rolloverTrade(requestData, user, sendMessage, modifiedRow)
      .then((result) => {
        if (result) {
          props.onActionComplete?.(result.uuid, 'rollover');
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
    <RolloverForm
      formik={formik}
      isFloatingRateTrade={props.selectedRows?.[0]?.rateType === 'Floating'}
    />
  );
};

export default ActionModal;
