import {
  SfAccordion,
  SfAccordionPanel,
  SfFormikNumericInput,
  SfFormikTextArea,
  str,
} from '@sfcm/framework';
import { ForeCol, FormContainer, FormHalfCol, FormRow } from '@sfcm/shared';
import { useEffect, useState } from 'react';
import { FormField, SF } from '@sfcm/modules';
import { DateFields } from './Dates';
import BuySellBack from './BuySellBack';
import UpdateStaticDropdown from './UpdateStaticDropdown';
import Delivery from './Delivery';
import Price from './Price';
import { ITradeUpdateFormComponentProps } from './types';

const Details = (props: ITradeUpdateFormComponentProps): JSX.Element => {
  const [isDetailsFormExpanded, setDetailsFormExpanded] = useState(false);

  useEffect(() => {
    if (isDetailsFormExpanded === false) {
      if (
        str.isNotEmpty(props.formik.values[SF.TRADE_TYPE]) &&
        str.isNotEmpty(props.formik.values[SF.BOOK]) &&
        str.isNotEmpty(props.formik.values[SF.COMPANY]) &&
        str.isNotEmpty(props.formik.values[SF.COUNTERPARTY]) &&
        str.isNotEmpty(props.formik.values[SF.ISIN]) &&
        props.formik.values[SF.QUANTITY] > 0 &&
        str.isNotEmpty(props.formik.values[SF.RATE_TYPE]) &&
        props.formik.values[SF.RATE_FEE] > 0 &&
        str.isNotEmpty(props.formik.values[SF.TERM_TYPE])
      ) {
        setDetailsFormExpanded(true);
      }
    }
  }, [props.formik.values]);

  useEffect(() => {
    if (str.isNotEmpty(props.formik.values[SF.SALESPERSON])) {
      props.formik.setFieldValue(SF.BROKER_FEE, null);
    } else if (str.isNotEmpty(props.formik.values[SF.BROKER])) {
      props.formik.setFieldValue(SF.SALES_CREDIT, null);
    }
  }, [props.formik.values[SF.BROKER], props.formik.values[SF.SALESPERSON]]);

  return (
    <SfAccordion id='acrd-trade-update-details' isSingleExpand>
      <SfAccordionPanel
        id='acpanel-trade-update-details-main'
        label='Details'
        isExpanded={isDetailsFormExpanded}>
        <FormContainer>
          <DateFields {...props} />

          <Price {...props} />

          <FormRow>
            <FormField.CollateralEligibility
              formik={props.formik}
              required={props.formik.values[SF.IS_BANK_LOAN]}
            />

            <UpdateStaticDropdown
              label={props.formik.values[SF.IS_LOAN_BORROW] ? 'Billing Method' : 'Interest Method'}
              dropdownType='InterestMethod'
              fieldId={props.formik.values[SF.IS_LOAN_BORROW] ? SF.BILL_METHOD : SF.INTEREST_METHOD}
              formik={props.formik}
            />

            <ForeCol colSpan={3}>
              <FormHalfCol position='left'>
                <UpdateStaticDropdown
                  dropdownType='Callable'
                  fieldId={SF.CALLABLE}
                  formik={props.formik}
                  colSpan={false}
                  disabled={props.formik.values[SF.IS_BANK_LOAN]}
                />
              </FormHalfCol>
              {!props.formik.values[SF.IS_LOAN_BORROW] && (
                <FormHalfCol position='right'>
                  <UpdateStaticDropdown
                    dropdownType='DayCount'
                    fieldId={SF.DAY_COUNT}
                    formik={props.formik}
                    colSpan={false}
                  />
                </FormHalfCol>
              )}
            </ForeCol>
            <UpdateStaticDropdown
              dropdownType='DeliveryInstructions'
              fieldId={SF.DELIVERY_INSTRUCTIONS}
              formik={props.formik}
              disabled={props.formik.values[SF.IS_BANK_LOAN] || props.lockDeliveryInstructions}
            />
          </FormRow>

          {!props.formik.values[SF.IS_BANK_LOAN] && (
            <FormRow>
              <FormField.Broker
                formik={props.formik}
                fieldId={SF.BROKER}
                brokerType='B'
                label='Broker'
                disabled={str.isNotEmpty(props.formik.values[SF.SALESPERSON])}
              />
              <SfFormikNumericInput
                fieldId={SF.BROKER_FEE}
                formik={props.formik}
                precision={6}
                disabled={str.isNotEmpty(props.formik.values[SF.SALESPERSON])}
              />
              <FormField.Broker
                formik={props.formik}
                fieldId={SF.SALESPERSON}
                brokerType='S'
                label='Salesperson'
                disabled={str.isNotEmpty(props.formik.values[SF.BROKER])}
              />
              <SfFormikNumericInput
                fieldId={SF.SALES_CREDIT}
                formik={props.formik}
                precision={6}
                disabled={str.isNotEmpty(props.formik.values[SF.BROKER])}
              />
            </FormRow>
          )}

          <Delivery {...props} />

          <FormRow>
            <SfFormikTextArea
              fieldId={SF.EXTERNAL_NARRATIVE}
              label='External Narrative'
              formik={props.formik}
              rows={2}
              colSpan={6}
            />
            <SfFormikTextArea
              fieldId={SF.INTERNAL_NARRATIVE}
              label='Internal Narrative'
              formik={props.formik}
              rows={2}
              colSpan={6}
            />
          </FormRow>

          <BuySellBack {...props} />
        </FormContainer>
      </SfAccordionPanel>
    </SfAccordion>
  );
};

export default Details;
