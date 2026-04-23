import { usePostDataRequest, useAuthentication, useMessageService } from '@sfcm/shared';
import { useEffect, useMemo } from 'react';
import { IActionModalProps } from '../../../types';
import { rePriceTrade } from './helper';
import { PriceChangeForm } from './form';
import { useFormManager } from 'components/shared/sf-form-manager';
import { getValidationSchema } from './validation';
import { str } from '@sfcm/framework';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Re-price');
  const { user } = useAuthentication();

  const initialValues = useMemo(() => {
    return {
      startDate: props?.systemConfig?.currentBusinessDate,
      newPrice: '',
      priceType: 'allInPrice',
      carryOverInterest: false,
      clearance: '',
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
    props.onSubmitEnabled?.(formik.isValid && !formik.isValidating);
  }, [formik.isValid, formik.isValidating, props]);

  const submit = () => {
    console.log(
      'Submit function called for Re-price action with selected rows:',
      props.selectedRows
    );

    formik.submitForm();
  };

  const submitForm = (values: any) => {
    const modifiedRow = {
      ...props.selectedRows?.[0],
      startDate: values.startDate,
      price: values.newPrice,
      priceType: values.priceType,
      carryOverInterest: values.carryOverInterest,
    };

    rePriceTrade(requestData, user, sendMessage, modifiedRow)
      .then((result) => {
        if (result.ok && !str.isEmpty(result.uuid)) {
          props.onActionComplete?.(result.uuid, 're-price');
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
    <PriceChangeForm
      startDate={props.selectedRows?.[0]?.startDate}
      endDate={props.selectedRows?.[0]?.endDate}
      termType={props.selectedRows?.[0]?.termType}
      formik={formik}
    />
  );
};

export default ActionModal;
