import { useAuthentication, useMessageService, usePostDataRequest } from '@sfcm/shared';
import { useEffect } from 'react';
import { IActionModalProps } from '../../../types';
import { verifyTrades } from './helper';
import { str } from '@sfcm/framework';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Cancel');
  const { user } = useAuthentication();

  useEffect(() => {
    props.submitAction(submit);
  }, [props.submitAction]);

  const submit = () => {
    verifyTrades(requestData, user, sendMessage, props.selectedRows)
      .then((result) => {
        if (result.ok && str.isNotEmpty(result.uuid)) {
          props.onActionComplete?.(result.uuid, 'cancel');
          console.log('Cancel action submitted successfully, pending UUID set:', result.uuid);
          props.onClose();
        }
      })
      .finally(() => {
        props.onClose();
      });
  };

  return <>Are you sure you want to cancel the selected trades?</>;
};

export default ActionModal;
