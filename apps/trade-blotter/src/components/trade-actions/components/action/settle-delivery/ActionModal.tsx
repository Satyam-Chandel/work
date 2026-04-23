import { useAuthentication, useMessageService, usePostDataRequest } from '@sfcm/shared';
import { useEffect } from 'react';
import { IActionModalProps } from './../../../../types';
import { settleDeliveryTrades } from './helper';
import { str } from '@sfcm/framework';

const ActionModal = (props: IActionModalProps): JSX.Element => {
  const { requestData } = usePostDataRequest();
  const { sendMessage } = useMessageService('Trade Blotter Settle Delivery');
  const { user } = useAuthentication();

  useEffect(() => {
    props.submitAction(submit);
  }, [props.submitAction]);

  const submit = () => {
    console.log(
      'Submit function called for Settle Delivery action with selected rows:',
      props.selectedRows
    );

    settleDeliveryTrades(requestData, user, sendMessage, props.selectedRows).then((result) => {
      if (result.ok && str.isNotEmpty(result.uuid)) {
        props.onActionComplete?.(result.uuid, 'settle-delivery');
        console.log('Settle Delivery action submitted successfully with UUID:', result.uuid);
        props.onClose();
      } else {
        props.onClose();
      }
    });
  };

  return <>Are you sure you want to settle the Delivery leg of the trades?</>;
};

export default ActionModal;
