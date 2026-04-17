import { FormikProps, str } from '@sfcm/framework';
import { useAuthentication, useInfoModal, usePostDataRequest, useServerEvents } from '@sfcm/shared';
import { useEffect, useRef, useState } from 'react';
import { cancelAndCorrectTrade } from '../helper';
import { TRADE_UPDATE_TOPIC } from '../serviceUrls';

/**
 * Trade events manager (amend trade, listen for updates)
 * @param formik Formik instance
 * @param onClose Callback to close the modal on success
 */
export const useCancelAndCorrectTradeManager = (
  _formik: FormikProps<any>,
  onClose: () => void
): { handleSubmit: (values: any) => void; isSubmitting: boolean } => {
  const { requestData } = usePostDataRequest();
  const { user } = useAuthentication();

  const { error, success } = useInfoModal();

  const { message } = useServerEvents(TRADE_UPDATE_TOPIC);

  const pendingUuid = useRef<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (
      str.isNotEmpty(pendingUuid.current) &&
      message?.financingTradeCommandResponseEntity?.uuid === pendingUuid.current
    ) {
      pendingUuid.current = null;
      setSubmitting(false);

      if (message?.financingTradeCommandResponseEntity?.errorResponse?.success === true) {
        success({
          title: `Successfully Cancelled and Corrected Deal ${new Date().toLocaleString()}`,
          message: 'New Action for Trade Status: Approved.',
          submitButtonText: 'Dismiss',
        });

        onClose();
      } else {
        error({
          message:
            message?.financingTradeCommandResponseEntity?.errorResponse?.errorDescription?.toString() ||
            'The trade cancellation and correction failed',
          submitButtonText: 'Dismiss',
        });
      }
    }
  }, [message, success, error, onClose]);

  const handleSubmit = (values: any) => {
    setSubmitting(true);

    cancelAndCorrectTrade(requestData, user, values)
      .then((response) => {
        if (response.ok && str.isNotEmpty(response.uuid)) {
          pendingUuid.current = response.uuid;
          // Request accepted; do not keep drawer spinner blocked indefinitely while waiting for server events.
          setSubmitting(false);
        } else {
          pendingUuid.current = null;
          setSubmitting(false);
          error({ message: 'The trade cancellation and correction failed' });
        }
      })
      .catch(() => {
        pendingUuid.current = null;
        setSubmitting(false);
        error({ message: 'The trade cancellation and correction failed' });
      });
  };

  return { handleSubmit, isSubmitting };
};
