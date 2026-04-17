import { FormikProps, str } from '@sfcm/framework';
import { useAuthentication, useInfoModal, usePostDataRequest, useServerEvents } from '@sfcm/shared';
import { useEffect, useRef, useState } from 'react';
import { amendTrade } from '../helper';
import { TRADE_UPDATE_TOPIC } from '../serviceUrls';

/**
 * Trade events manager (amend trade, listen for updates)
 * @param formik Formik instance
 * @param onClose Callback to close the modal on success
 */
export const useAmendTradeManager = (
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
          title: `Successfully Updated Deal ${new Date().toLocaleString()}`,
          message: 'New Action for Trade Status: Approved.',
          submitButtonText: 'Dismiss',
        });

        onClose();
      } else {
        error({
          message:
            message?.financingTradeCommandResponseEntity?.errorResponse?.errorDescription?.toString() ||
            'The trade update failed',
          submitButtonText: 'Dismiss',
        });
      }
    }
  }, [message, success, error, onClose]);

  const handleSubmit = (values: any) => {
    setSubmitting(true);

    amendTrade(requestData, user, values)
      .then((response) => {
        if (response.ok && str.isNotEmpty(response.uuid)) {
          pendingUuid.current = response.uuid;
          // Keep spinner until backend lifecycle event arrives.
        } else {
          pendingUuid.current = null;
          setSubmitting(false);
          error({ message: 'The trade update failed' });
        }
      })
      .catch(() => {
        pendingUuid.current = null;
        setSubmitting(false);
        error({ message: 'The trade update failed' });
      });
  };

  return { handleSubmit, isSubmitting };
};
