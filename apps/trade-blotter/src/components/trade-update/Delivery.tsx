import { FormRow } from '@sfcm/shared';
import { FormField, SF } from '@sfcm/modules';
import { ITradeUpdateFormComponentProps } from './types';
import UpdateStaticDropdown from './UpdateStaticDropdown';

const Delivery = (props: ITradeUpdateFormComponentProps): JSX.Element => {
  return (
    <FormRow>
      <FormField.Account
        depotAccountType={
          props.formik.values[SF.IS_BANK_LOAN]
            ? SF.COMPANY_BANK_ACCOUNT
            : SF.COMPANY_DEPOT_ACCOUNT
        }
        formik={props.formik}
      />

      <UpdateStaticDropdown
        dropdownType='DepotAccountMedium'
        fieldId={SF.COMPANY_MEDIUM}
        formik={props.formik}
        required={props.formik.values[SF.IS_PLEDGE_RECEIVE]}
      />

      <FormField.Account
        depotAccountType={
          props.formik.values[SF.IS_BANK_LOAN]
            ? SF.CLIENT_BANK_ACCOUNT
            : SF.CLIENT_DEPOT_ACCOUNT
        }
        formik={props.formik}
      />

      {props.formik.values[SF.IS_PLEDGE_RECEIVE] === false && (
        <FormField.Agreement formik={props.formik} disabled={props.lockAgreement} />
      )}
    </FormRow>
  );
};

export default Delivery;
