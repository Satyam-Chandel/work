import { useAuthentication, useMessageService, usePostDataRequest } from '@sfcm/shared';
import { useEffect } from 'react';
import { IActionModalProps } from './../../../../types';
import { verifyTrades } from './helper';
import { str } from '@sfcm/framework';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Verify');
  const { user } = useAuthentication();

  useEffect(() => {
    props.submitAction(submit);
  }, [props.submitAction]);

  const submit = () => {
    console.log('Submit function called for Verify action with selected rows:', props.selectedRows);

    verifyTrades(requestData, user, sendMessage, props.selectedRows).then((result) => {
      if (result.ok && str.isNotEmpty(result.uuid)) {
        props.onActionComplete?.(result.uuid, 'verify');
        console.log('Verify action submitted successfully with UUID:', result.uuid);
        props.onClose();
      } else {
        props.onClose();
      }
    });
  };

  return <>Are you sure you want to verify the selected trades?</>;
};

export default ActionModal;
