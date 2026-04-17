import { FormikProps, SfSpinner } from '@sfcm/framework';
import { useEffect, useMemo, useRef } from 'react';
import { StaticDateManager, getValidationSchema } from '@sfcm/modules';
import { useFormManager } from 'components/shared/sf-form-manager';
import { SF } from 'components/shared/sf-entities/const';
import { IActionModalProps } from '../../trade-actions/types';
import { GeneralTradeTypeEnum } from 'components/trade-blotter/types';
import { translateRowToFormValues } from './translation';
import { useCancelAndCorrectTradeManager } from './hooks/useCancelAndCorrectTradeManager';
import TradeUpdateFormClassic from '../index';

/** Must match `SfDrawer` id in `trade-actions/components/manager` so Enter is handled in capture before inner dropdowns. */
const TRADE_ACTION_DRAWER_ID = 'drawer-tb-action';
const INFO_MODAL_SUBMIT_BUTTON_ID = 'btn-modal-common-info-submit';

const isElementVisible = (element: HTMLElement): boolean => {
  if (!element.isConnected) {
    return false;
  }
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  return Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};

const isElementDisabled = (element: HTMLElement): boolean =>
  element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formikRef = useRef<FormikProps<Record<string, unknown>> | null>(null);
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

  const { handleSubmit, isSubmitting } = useCancelAndCorrectTradeManager(formik, props.onClose);

  formikRef.current = formik as FormikProps<Record<string, unknown>>;

  useEffect(() => {
    props.submitAction(() => {
      formik.submitForm();
    });
  }, [formik, props]);

  useEffect(() => {
    props.onSubmitEnabled?.(formik.isValid && !formik.isValidating && !isSubmitting);
  }, [formik.isValid, formik.isValidating, isSubmitting, props]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const formRoot = containerRef.current;
      if (!formRoot) {
        return;
      }

      if (event.key !== 'Enter' || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      const path = event.composedPath?.() ?? [];
      const activeElement = document.activeElement;

      const drawerEl = document.getElementById(TRADE_ACTION_DRAWER_ID);
      if (drawerEl instanceof HTMLElement && !isElementVisible(drawerEl)) {
        return;
      }

      // This component only mounts for cancel-and-correct. composedPath / contains miss shadow + portaled focus,
      // so do not require path.includes(formRoot) — that made every Enter exit early with no preventDefault.
      if (
        !(activeElement instanceof HTMLElement) ||
        activeElement === document.body ||
        activeElement === document.documentElement
      ) {
        return;
      }

      if (activeElement.closest('#btn-tb-action-cancel')) {
        return;
      }

      const target =
        event.target instanceof HTMLElement
          ? event.target
          : path.find((node): node is HTMLElement => node instanceof HTMLElement) ?? null;
      if (!target) {
        return;
      }

      if (target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // If the common info modal is open, Enter should dismiss that modal first.
      const infoModalSubmitButton = document.getElementById(INFO_MODAL_SUBMIT_BUTTON_ID);
      if (
        infoModalSubmitButton instanceof HTMLElement &&
        isElementVisible(infoModalSubmitButton) &&
        !isElementDisabled(infoModalSubmitButton)
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        infoModalSubmitButton.click();
        return;
      }

      // Only submit from within the trade-action drawer. If focus is outside (e.g. info/error modal),
      // let that surface handle Enter.
      if (drawerEl instanceof HTMLElement && !drawerEl.contains(activeElement)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      // Same path as footer primary: validates when invalid, runs onSubmit when valid (avoids SfButton id/DOM quirks).
      void formikRef.current?.submitForm();
    };

    // Window capture runs before document (useEnterSubmit) so this handler wins for this drawer.
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  return (
    <div ref={containerRef} data-enter-submit='false'>
      <SfSpinner id='spinner-tb-cancel-correct' show={isSubmitting} />
      <TradeUpdateFormClassic formik={formik} />

      <StaticDateManager formik={formik} />
    </div>
  );
};

export default ActionModal;
