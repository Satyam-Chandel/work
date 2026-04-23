import { usePostDataRequest, useAuthentication, useMessageService } from '@sfcm/shared';
import { useEffect, useMemo } from 'react';
import { IActionModalProps } from './../../../../types';
import { reRateTrades } from './helper';
import { RateChangeForm } from './form';
import { useFormManager } from 'components/shared/sf-form-manager';
import { getValidationSchema } from './validation';
import { str } from '@sfcm/framework';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Re-rate');
  const { user } = useAuthentication();

  const computeDateRange = useMemo(() => {
    let minDateValue: any;
    let maxDateValue: any;
    let isOpenTradeThere = false;

    props.selectedRows?.forEach((row) => {
      if (minDateValue && minDateValue > row.startDate) {
        minDateValue = row.startDate;
      } else {
        minDateValue = row.startDate;
      }
      if (maxDateValue && maxDateValue < row.endDate) {
        maxDateValue = row.endDate;
      } else {
        maxDateValue = row.endDate;
      }
      if (row?.termType === 'Open') {
        isOpenTradeThere = true;
      }
    });

    return {
      minDate: minDateValue,
      maxDate: isOpenTradeThere ? undefined : maxDateValue,
    };
  }, [props.selectedRows]);
  const initialValues = useMemo(() => {
    return {
      startDate: props?.systemConfig?.currentBusinessDate,
      rateFee: '',
    };
  }, [computeDateRange.minDate]);

  const validationSchema = useMemo(() => {
    return getValidationSchema({
      minDate: computeDateRange.minDate,
      maxDate: computeDateRange.maxDate,
    });
  }, [computeDateRange]);

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
      'Submit function called for Re-rate action with selected rows:',
      props.selectedRows
    );

    formik.submitForm();
  };

  const submitForm = (values: any) => {
    const modifiedRows = props.selectedRows?.map((row) => {
      const inputRateFee = String(values.rateFee ?? '').trim();
      const firstChar = inputRateFee.charAt(0);
      const parsedInputRateFee = Number(inputRateFee.slice(1));
      const existingRateFee = Number(row.rateFee);

      let updatedRateFee: any = values.rateFee;
      if (
        firstChar === '+' &&
        !Number.isNaN(parsedInputRateFee) &&
        !Number.isNaN(existingRateFee)
      ) {
        updatedRateFee = existingRateFee + parsedInputRateFee;
      } else if (
        firstChar === '-' &&
        !Number.isNaN(parsedInputRateFee) &&
        !Number.isNaN(existingRateFee)
      ) {
        updatedRateFee = existingRateFee - parsedInputRateFee;
      }

      return {
        ...row,
        startDate: values.startDate,
        rateFee: updatedRateFee,
      };
    });
    console.log('Modified rows ', modifiedRows);

    reRateTrades(requestData, user, sendMessage, modifiedRows)
      .then((result) => {
        if (result.ok && !str.isEmpty(result.uuid)) {
          props.onActionComplete?.(result.uuid, 're-rate');
          console.log('Re-rate action submitted successfully, pending UUID set:', result.uuid);
          props.onClose();
        } else {
          props.onClose();
        }
      })
      .finally(() => {
        props.onClose();
      });
  };

  return (
    <RateChangeForm
      startDate={computeDateRange.minDate}
      endDate={computeDateRange.maxDate}
      formik={formik}
    />
  );
};

export default ActionModal;
