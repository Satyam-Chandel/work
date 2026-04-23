import { SfFormikDateInput } from '@sfcm/framework';
import { IFormComponentProps } from 'components/shared/sf-form-manager';
import { ModalFormRow } from '../styled';
import { useEffect, useRef } from 'react';

export const FullReturnForm = (props: IFormComponentProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (rowRef.current) {
        const componentToFocus = rowRef.current?.querySelector<HTMLInputElement>('input');
        if (componentToFocus) {
          componentToFocus.focus();
        }
      }
    }, 500);
  }, []);

  return (
    <ModalFormRow ref={rowRef}>
      <SfFormikDateInput
        id='date-fr-return-date'
        fieldId='returnDate'
        label='Return Date'
        formik={props.formik}
        colSpan={6}
        disableWeekends
        disabledDates={['2026-01-01', '2026-01-15', '2026-01-26']} //We can change this later with holidays service
        required
      />
    </ModalFormRow>
  );
};
