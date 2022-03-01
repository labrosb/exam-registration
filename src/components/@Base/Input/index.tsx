import React, { useState, useEffect, useRef, InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // If the input is mandatory
  required?: boolean;
  // If the input is submitted (used to force error show)
  submitted?: boolean;
  // If the input value is reset (used to avoid triggering an error on input clear);
  reset?: boolean;
  // Callback on error
  onError?: (v: any) => void;
  // Custom callback handling on value change
  onValueChange: (v?: any) => void;
};

type InputValue = string | number | readonly string[] | undefined;

/** Text input with validation and error message handling */
function Input({
  name,
  placeholder,
  value,
  type,
  required,
  submitted = false,
  reset,
  onError,
  onValueChange,
  ...rest
}: InputProps): React.ReactElement {
  const validatedOnce = useRef(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isNewSubmit, setIsNewSubmit] = useState(false);

  const validate = (val: InputValue, showError = true) => {
    if (!onError) return;

    const errorKey = name || placeholder as string;

    const handleError = (hasError: boolean, errorMsg: string = '') => {
      onError({ [errorKey]: hasError });
      if (showError) {
        setErrorMessage(errorMsg);
      };
    };

    if (required && !val) {
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

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = ev.target;

    validate(newValue, true);
    setIsNewSubmit(false);

    if (onValueChange) {
      onValueChange(newValue);
    };
  };

  return (
    <div className="base-input-container">
      <input
        className="base-input"
        onChange={handleChange}
        {...{
          name,
          value,
          type,
          placeholder,
          ...rest
        }}
      />
      {errorMessage
        ? <p className="base-input-error">
            {errorMessage}
          </p>
        : null}
    </div>
  );
}

export default Input;