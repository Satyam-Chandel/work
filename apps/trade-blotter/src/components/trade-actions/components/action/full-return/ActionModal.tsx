import { usePostDataRequest, useAuthentication, useMessageService } from '@sfcm/shared';
import { useEffect, useMemo, useRef } from 'react';
import { IActionModalProps } from '../../../types';
import { FullReturnForm } from './form';
import { useFormManager } from 'components/shared/sf-form-manager';
import { getValidationSchema } from './validation';
import { str } from '@sfcm/framework';
import { fullReturnTrades } from './helper';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Full Return');
  const { user } = useAuthentication();

  const initialValues = useMemo(() => {
    return {
      returnDate: '',
    };
  }, [props.selectedRows]);

  const validationSchema = useMemo(() => {
    return getValidationSchema({
      minDate: props.selectedRows[0]?.actualSettlementDate,
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
      'Submit function called for full return action with selected rows:',
      props.selectedRows
    );

    formik.submitForm();
  };

  const submitForm = (values: any) => {
    const modifiedRow = {
      ...props.selectedRows?.[0],
      returnDate: values.returnDate,
      quantity: Math.abs(props.selectedRows?.[0]?.outstandingQuantityIncPendingReturns),
    };
    console.log('Modified row', modifiedRow);

    fullReturnTrades(requestData, user, sendMessage, modifiedRow)
      .then((result) => {
        if (result.ok && !str.isEmpty(result.uuid)) {
          props.onActionComplete?.(result.uuid, 'full-return');
          console.log('Full Return action submitted successfully, pending UUID set:', result.uuid);
          props.onClose();
        } else {
          props.onClose();
        }
      })
      .finally(() => {
        props.onClose();
      });
  };

  return <FullReturnForm formik={formik} />;
};

export default ActionModal;
