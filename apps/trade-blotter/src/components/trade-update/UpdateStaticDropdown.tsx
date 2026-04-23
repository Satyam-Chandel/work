import { FormikProps, ISfDropdownOption, SfFormikDropdown, str } from '@sfcm/framework';
import { useEffect, useState } from 'react';
import { SF } from '@sfcm/modules';

interface UpdateStaticDropdownProps {
  formik: FormikProps<any>;
  dropdownType: string;
  fieldId: string;
  label?: string;
  errorAsTooltip?: boolean;
  colSpan?: number | boolean;
  disabled?: boolean;
  required?: boolean;
}

interface IDropdownValue extends ISfDropdownOption {
  attributes?: {
    type: string;
    value: string;
  }[];
}

const isAllowedForTradeType = (option: IDropdownValue, tradeType: string): boolean => {
  const excludedTradeTypes: string[] =
    option.attributes
      ?.filter((attr) => attr.type === 'ExcludedTradeType')
      ?.map((attr) => attr.value) ?? [];

  return !excludedTradeTypes.includes(tradeType);
};

const UpdateStaticDropdown = (props: UpdateStaticDropdownProps): JSX.Element => {
  const tradeType = props.formik.values?.[SF.TRADE_TYPE];
  const [optionsList, setOptionsList] = useState<ISfDropdownOption[]>([]);

  useEffect(() => {
    if (props.formik.values?.[SF.STATIC_DROPDOWNS]?.isReady && props.formik.values) {
      const values: IDropdownValue[] =
        props.formik.values?.[SF.STATIC_DROPDOWNS]?.data?.find(
          (x: any) => x.dropdownType === props.dropdownType
        )?.values ?? [];

      setOptionsList(values.filter((x) => isAllowedForTradeType(x, tradeType)));
    }
  }, [props.formik.values?.[SF.STATIC_DROPDOWNS], props.dropdownType, tradeType]);

  useEffect(() => {
    if (!props.formik.values || optionsList.length === 0) {
      return;
    }

    const currentValue = props.formik.values?.[props.fieldId];

    console.log('Current value:', currentValue);
    console.log('TernType:', props.formik.values?.[SF.TERM_TYPE]);
    console.log('Options list:', optionsList);

    const exactMatch = optionsList.find((x) => x.value === currentValue);
    if (exactMatch) {
      return;
    }

    const exactOrLabelMatch = str.isNotEmpty(currentValue)
      ? optionsList.find((x) => {
          return x.value === currentValue || x.label === currentValue;
        })
      : undefined;

    if (exactOrLabelMatch) {
      props.formik.setFieldValue(props.fieldId, exactOrLabelMatch.value);
    }
  }, [optionsList, props.fieldId, props.formik]);

  return (
    <SfFormikDropdown
      fieldId={props.fieldId}
      options={optionsList}
      formik={props.formik}
      colSpan={props.colSpan}
      errorAsTooltip={props.errorAsTooltip}
      label={props.label}
      disabled={props.disabled}
      required={props.required}
      autoSelectFirstOption={false}
    />
  );
};

export default UpdateStaticDropdown;
