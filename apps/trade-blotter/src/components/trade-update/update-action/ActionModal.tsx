import { SfSpinner } from '@sfcm/framework';
import { useEffect, useMemo } from 'react';
import { StaticDateManager, getValidationSchema } from '@sfcm/modules';
import { useFormManager } from 'components/shared/sf-form-manager';
import { SF } from 'components/shared/sf-entities/const';
import { IActionModalProps } from '../../trade-actions/types';
import { GeneralTradeTypeEnum } from 'components/trade-blotter/types';
import { translateRowToFormValues } from './translation';
import { useAmendTradeManager } from './hooks/useAmendTradeManager';
import TradeUpdateFormClassic from './index';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const selectedTrade = props.selectedRows?.[0];

  const initialValues = useMemo(() => {
    const prefillValues = translateRowToFormValues(selectedTrade);

    return {
      [SF.GENERAL_TRADE_TYPE]: GeneralTradeTypeEnum.Classic,
      ...prefillValues,
    };
  }, [selectedTrade]);

  const { formik } = useFormManager({
    initialValues,
    validationSchema: getValidationSchema({ isUpdate: true }),
    handleSubmit: (values) => handleSubmit(values),
    forceValidation: true,
  });

  const { handleSubmit, isSubmitting } = useAmendTradeManager(formik, props.onClose);
  const isDrawerBusy = isSubmitting || formik.isValidating;

  useEffect(() => {
    props.submitAction(() => {
      formik.submitForm();
    });
  }, [formik, props]);

  useEffect(() => {
    props.onSubmitEnabled?.(formik.isValid && !isDrawerBusy);
  }, [formik.isValid, isDrawerBusy, props]);

  return (
    <div data-enter-submit='false'>
      <SfSpinner id='spinner-tb-update-trade' show={isDrawerBusy} />
      <TradeUpdateFormClassic formik={formik} />

      <StaticDateManager formik={formik} />
    </div>
  );
};

export default ActionModal;
