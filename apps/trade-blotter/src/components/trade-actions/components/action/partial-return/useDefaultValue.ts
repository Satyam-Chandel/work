import { FormikProps } from '@sfcm/framework';
import { useEffect } from 'react';

export interface IUseDefaultValueProps {
  formik:FormikProps<any>;
  selectedRow:any;
}

export const useDefaultValue = (props:IUseDefaultValueProps) => {
  useEffect(() => {
    switch (props.formik.values.priceType) {
      case 'AllInPrice':
        props.formik.setFieldValue('price', props.selectedRow?.allInPrice || '');
        break;
      case 'CleanPrice':
        props.formik.setFieldValue('price', props.selectedRow?.price || '');
        break;
      case 'DirtyPrice':
        props.formik.setFieldValue('price', props.selectedRow?.dirtyPrice || '');
        break;
      default:
        break;
    }
  }, [props.formik.values.priceType]);
}
