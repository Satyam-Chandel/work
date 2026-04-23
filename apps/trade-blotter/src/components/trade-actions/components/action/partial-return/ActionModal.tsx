import { usePostDataRequest, useAuthentication, useMessageService } from '@sfcm/shared';
import { useEffect, useMemo } from 'react';
import { IActionModalProps } from '../../../types';
import { partialReturn } from './helper';
import { PartialReturnForm } from './form';
import { useFormManager } from 'components/shared/sf-form-manager';
import { getValidationSchema } from './validation';
import { useDefaultValue } from './useDefaultValue';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Re-price');
  const { user } = useAuthentication();

  const initialValues = useMemo(() => {
    return {
      startDate: props?.systemConfig?.currentBusinessDate,
      newPrice:
        props.selectedRows?.[0]?.allInPrice ??
        (props.selectedRows?.[0]?.dirtyPrice ?? 0) / (props.selectedRows?.[0]?.haircut ?? 1),
      quantity: '',
      carryOverInterest: false,
      priceType: 'allInPrice',
    };
  }, [props.selectedRows]);

  const validationSchema = useMemo(() => {
    return getValidationSchema({
      minDate: props.selectedRows?.[0]?.startDate,
      maxDate: props.selectedRows?.[0]?.endDate,
      maxQuantityToReturn: Math.abs(props.selectedRows?.[0]?.outstandingQuantityIncPendingReturns),
      isTradeSbl: props.selectedRows?.[0]?.tradeType === 'Loan',
    });
  }, [props.selectedRows]);

  const { formik } = useFormManager({
    initialValues,
    validationSchema,
    handleSubmit: (values) => submitForm(values),
    forceValidation: true,
  });

  useDefaultValue({
    formik,
    selectedRow: props.selectedRows?.[0],
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
      returnDate: values.startDate,
      price: values.priceType === 'Clean' ? values.newPrice : props.selectedRows?.[0].price,
      dirtyPrice:
        values.priceType === 'Dirty' ? values.newPrice : props.selectedRows?.[0].dirtyPrice,
      allInPrice:
        values.priceType === 'AllInPrice' ? values.newPrice : props.selectedRows?.[0].allInPrice,
      carryOverInterest: values.carryOverInterest,
      quantity: values.quantity,
    };

    partialReturn(requestData, user, sendMessage, modifiedRow)
      .then((result) => {
        if (result) {
          props.onActionComplete?.(result.uuid, 'partial-return');
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
    <PartialReturnForm isTradeSbl={props.selectedRows?.[0]?.tradeType === 'Loan'} formik={formik} />
  );
};

export default ActionModal;
