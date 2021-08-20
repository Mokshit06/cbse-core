import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DatePicker(props: ReactDatePickerProps) {
  return <ReactDatePicker {...props} />;
}

export default DatePicker;
