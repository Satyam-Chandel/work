import { SfButton, SfDrawer, SfModal, str } from '@sfcm/framework';
import { ACTION_CALL_TRADE_ACTION, Context } from 'components/trade-blotter/context';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IActionModule } from './../../types';
import { actionRegistry } from './../actions';
import {
  useAuthentication,
  useInfoModal,
  usePostDataRequest,
  useServerEvents,
} from '@sfcm/shared';
import { TRADE_LIFECYCLE_EVENT_TOPIC } from './../actions/serviceUrls';
import {
  getMessageUponActionCompletion,
  prepareErrorMessageFromFailedTrades,
} from './../actions/helper';
import { getSystemConfig } from './../actions/api';

const Manager = (): JSX.Element => {
  const { setData, useActionEffect } = useContext(Context);
  const [isVisible, setVisible] = useState<boolean>(false);
  const [isSubmitEnabled, setSubmitEnabled] = useState<boolean>(true);
  const currentModule = useRef<IActionModule | null>(null);
  const currentAction = useRef<(() => void) | null>(null);
  const selectedRows = useRef<any[]>([]);
  const statusChangeRef = useRef<string | null>('');
  const updateAction = useRef<string>('');
  const selectedRowsCount = useRef<number>(0);
  const batchMessages = useRef<any[]>([]);
  const failedTrades = useRef<any[]>([]);
  const systemConfig = useRef<any>(null);

  const { requestData } = usePostDataRequest();
  const { user } = useAuthentication();

  const { error, success } = useInfoModal();
  const { message } = useServerEvents(TRADE_LIFECYCLE_EVENT_TOPIC);

  const resetBatchState = () => {
    batchMessages.current = [];
    failedTrades.current = [];
  };

  const getFailedTrades = (messages: any[]) => {
    return messages.filter(
      (item) =>
        item?.financingTradeLifeCycleCommandResponseEntity?.errorResponse?.success === false &&
        item?.financingTradeLifeCycleCommandResponseEntity?.errorResponse?.errorResponseResult ===
          'Rejected'
    );
  };

  const showErrorModal = (messageText?: string) => {
    error({
      title: getMessageUponActionCompletion(updateAction.current, new Date().toLocaleString())
        ?.errorTitle,
      message: str.isNotEmpty(messageText)
        ? messageText
        : getMessageUponActionCompletion(updateAction.current, new Date().toLocaleString())
            ?.errorMessageBody,
      submitButtonText: getMessageUponActionCompletion(updateAction.current, new Date().toLocaleString())
        ?.errorSubmitButtonText,
    });
  };

  const showSuccessModal = (messageText?: string) => {
    let finalMessage = messageText;
    const outcomeRef = message?.financingTradeLifeCycleCommandResponseEntity?.identifiers?.find(
      (identifier: any) => identifier.type === 'OutcomeReference'
    )?.value;
    if (outcomeRef !== undefined && outcomeRef !== null) {
      finalMessage = `Trade Successfully created with Ref ${outcomeRef}`;
    }

    success({
      title: getMessageUponActionCompletion(updateAction.current, new Date().toLocaleString())
        ?.successTitle,
      message: str.isNotEmpty(finalMessage)
        ? finalMessage
        : getMessageUponActionCompletion(updateAction.current, new Date().toLocaleString())
            ?.successBody,
      submitButtonText: getMessageUponActionCompletion(updateAction.current, new Date().toLocaleString())
        ?.successSubmitButtonText,
    });
  };

  useEffect(() => {
    console.log('Life cycle message received :', TRADE_LIFECYCLE_EVENT_TOPIC, message);
    if (str.isNotEmpty(statusChangeRef.current)) {
      if (message?.financingTradeLifeCycleCommandResponseEntity?.batchUuid === statusChangeRef.current) {
        batchMessages.current.push(message);
        console.log('Batch messages received so far', batchMessages.current);
        if (batchMessages.current.length === selectedRowsCount.current) {
          console.log('All batch messages received, processing responses.', batchMessages.current);
          failedTrades.current = getFailedTrades(batchMessages.current);
          console.log('Failed trades in batch', failedTrades.current);
          const errorText = prepareErrorMessageFromFailedTrades(failedTrades.current);
          if (failedTrades?.current?.length === batchMessages.current.length) {
            showErrorModal(errorText);
          } else {
            showSuccessModal(errorText);
          }
          resetBatchState();
        }
      } else if (
        message?.financingTradeLifeCycleCommandResponseEntity?.uuid === statusChangeRef.current
      ) {
        if (message?.financingTradeLifeCycleCommandResponseEntity?.errorResponse?.success === true) {
          showSuccessModal();
        } else if (
          message?.financingTradeLifeCycleCommandResponseEntity?.errorResponse?.success === false &&
          message?.financingTradeLifeCycleCommandResponseEntity?.errorResponse?.errorResponseResult ===
            'Rejected'
        ) {
          const errorText = prepareErrorMessageFromFailedTrades([message]);
          showErrorModal(errorText);
        }
      }
    }
  }, [message]);

  useEffect(() => {
    setData({ EventList: actionRegistry });
    getSystemConfig(requestData, user, {}).then((response) => {
      if (response.ok) {
        systemConfig.current = response.data;
      }
    });
  }, []);

  useActionEffect<{ id: string; items: any[] }>((menuAction) => {
    console.log('call action', menuAction);
    const action = actionRegistry.find((x) => x?.actionModalConfig?.id === menuAction.id);
    if (action) {
      selectedRows.current = menuAction.items;
      currentAction.current = null;
      currentModule.current = action;
      setSubmitEnabled(true);
      setVisible(true);
    }
  }, ACTION_CALL_TRADE_ACTION);

  const submitAction = useCallback((action: () => void) => {
    currentAction.current = action;
    resetBatchState();
  }, []);

  const handleActionComplete = useCallback((uuid: string, actionType: string) => {
    statusChangeRef.current = uuid;
    updateAction.current = actionType;
    selectedRowsCount.current = selectedRows.current.length;
  }, []);

  const closeAction = useCallback(() => {
    setVisible(false);
    setSubmitEnabled(true);
    currentAction.current = null;
    currentModule.current = null;
    selectedRows.current = [];
  }, []);

  return (
    <div>
      {currentModule.current?.Drawer ? (
        <SfDrawer
          id='drawer-tb-action'
          label={currentModule.current.actionModalConfig?.title}
          show={isVisible}
          onHide={closeAction}
          onBack={closeAction}
          width={1100}
          showBackButton
          hideFooter={false}
          body={
            <div>
              <currentModule.current.Drawer
                selectedRows={selectedRows.current}
                onClose={closeAction}
                submitAction={submitAction}
                onSubmitEnabled={setSubmitEnabled}
                onActionComplete={handleActionComplete}
              />
            </div>
          }
          footer={
            <>
              <SfButton id='btn-tb-action-cancel' label='Cancel' onClick={closeAction} secondary />

              <SfButton
                id='btn-tb-action-submit'
                label={currentModule.current.actionModalConfig?.title ?? 'Confirm'}
                disabled={!isSubmitEnabled}
                onClick={() => currentAction.current?.()}
              />
            </>
          }
        />
      ) : (
        <SfModal
          id='modal-tb-action'
          show={isVisible}
          label={currentModule.current?.actionModalConfig?.title}
          onSubmit={() => currentAction.current?.()}
          onHide={closeAction}
          submitButtonText='Confirm'
          submitButtonDisabled={!isSubmitEnabled}
          headerIconName='info'
          size='sm'
          headerIconColor='var(--status-warning-accent)'>
          {currentModule.current?.Modal && (
            <currentModule.current.Modal
              selectedRows={selectedRows.current}
              onClose={closeAction}
              submitAction={submitAction}
              onSubmitEnabled={setSubmitEnabled}
              onActionComplete={handleActionComplete}
              systemConfig={systemConfig.current}
            />
          )}
        </SfModal>
      )}
    </div>
  );
};

export default Manager;
