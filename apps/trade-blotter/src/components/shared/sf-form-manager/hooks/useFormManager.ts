import { FormikProps, ObjectSchema, useFormik } from '@sfcm/framework';
import { useEffect } from 'react';

interface IFormManagerProps {
  initialValues: any;
  validationSchema: ObjectSchema<any>;
  handleSubmit: (values: any) => void;
  handleReset?: () => void;
  handleValidChanged?: (isValid: boolean) => void;
  disableReinitialize?: boolean;
  /* If TRUE, forces validation on every value change */
  forceValidation?: boolean;
}

export const useFormManager = (props: IFormManagerProps): { formik: FormikProps<any> } => {
  const formik = useFormik({
    initialValues: props.initialValues,
    validationSchema: props.validationSchema,
    onSubmit: (values: any) => props.handleSubmit(values),
    validateOnChange: true,
    //validateOnBlur: true,
    //validateOnMount: true,
    enableReinitialize: props?.disableReinitialize ?? true,
    onReset: props?.handleReset ? () => props.handleReset!() : undefined,
  });

  useEffect(() => {
    if (props.handleValidChanged) {
      props.handleValidChanged(formik.isValid);
    }
  }, [formik.isValid]);

  useEffect(() => {
    if (props.forceValidation) {
      formik.validateForm();
    }
  }, [formik.values, props.forceValidation]);

  return {
    formik,
  };
};

export default useFormManager;
