import { useAuthentication, useMessageService, usePostDataRequest } from '@sfcm/shared';
import { useEffect } from 'react';
import { IActionModalProps } from './../../../../types';
import { unsettledeliveryTrades } from './helper';
import { str } from '@sfcm/framework';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter UnSettle');
  const { user } = useAuthentication();

  useEffect(() => {
    props.submitAction(submit);
  }, [props.submitAction]);

  const submit = () => {
    console.log('Submit function called for Unsettle action with selected rows:', props.selectedRows);

    unsettledeliveryTrades(requestData, user, sendMessage, props.selectedRows).then((result) => {
      if (result.ok && str.isNotEmpty(result.uuid)) {
        props.onActionComplete?.(result.uuid, 'unsettle');
        console.log('Unsettle action submitted successfully with UUID:', result.uuid);
        props.onClose();
      } else {
        props.onClose();
      }
    });
  };

  return <>Are you sure you want to unsettle the selected trades?</>;
};

export default ActionModal;
