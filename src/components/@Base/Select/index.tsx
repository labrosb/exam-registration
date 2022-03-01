import React, { useState, useEffect, useRef, SelectHTMLAttributes } from 'react';
import './Select.css';

interface SelectOption {
  value: any;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  // The title / default value of the select
  title?: string;
  // If the input is mandatory
  required?: boolean;
  // If the input is submitted (used to force error show)
  submitted?: boolean;
  // If the input value is reset (used to avoid triggering an error on input clear);
  reset?: boolean;
  // The options of select
  options: SelectOption[];
  // Callback on error
  onError?: (v: any) => void;
  onChange: (e: any) => void;
}

type InputValue = string | number | readonly string[] | undefined;

export function generateOptions(options: string[]) {
  return options.map((option) => ({ value: option, label: option }));
}

function Select({
  id,
  title = "-",
  options,
  value,
  required,
  submitted = false,
  reset,
  onError,
  onChange,
  ...rest
}: SelectProps): React.ReactElement {
  const validatedOnce = useRef(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isNewSubmit, setIsNewSubmit] = useState(false);

  const validate = (val: InputValue, showError = true) => {
    if (!onError) return;

    const errorKey = id || title as string;

    const handleError = (hasError: boolean, errorMsg: string = '') => {
      onError({ [errorKey]: hasError });
      if (showError) {
        setErrorMessage(errorMsg);
      }
    };

    if (required && val === '') {
      handleError(true, 'The field is required');
    /** Add more validation cases here */
    } else {
      handleError(false);
    }
  };

  useEffect(() => {
    // Handling the submit internally so we don't have to reset it always in the parent.
    setIsNewSubmit(submitted);
  }, [submitted]);

  useEffect(() => {
    // If a new submit is triggered
    if (isNewSubmit && validatedOnce.current) {
      validate(value, true);
    } else if (!validatedOnce.current) {
    // If first validation (on init)
      validate('', false);
      validatedOnce.current = true;
    }
    // We don't want 'validate' in the args
    // @ts-ignore
  }, [isNewSubmit, value]);

  useEffect(() => {
    if (reset) {
      validatedOnce.current = false;
    }
  }, [reset]);

  const handleChange = (ev: any) => {
    const { value: newValue } = ev.target;
    validate(newValue, true);
    setIsNewSubmit(false);
    onChange(newValue);
  };
  
  const placeholderClass = required && value === ''
    ? "base-select-unselected"
    : "";
  
  return (
    <>
      <select
        className={`base-select ${placeholderClass}`}
        onChange={handleChange}
        value={value}
        {...rest}
      >
        {title && (
          <option
            className="base-select-selected"
            disabled={required && value !== ""}
            key={`op-${options[0].value}-no-value`}
            value=""
          >
            {title}
          </option>
        )}
        {options.map((option) => (
          <option
            key={`op-${option.value}`}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage
        ? <p className="base-select-error">
            {errorMessage}
          </p>
        : null}
    </>
  );
}

export default Select;
