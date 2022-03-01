import React, { ButtonHTMLAttributes } from 'react';
import './Button.css';

interface InputProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // The button's label
  title: string;
};

/** Basic form Button */
function Button({
  title,
  ...rest
}: InputProps): React.ReactElement {

  return (
      <button
        className="base-button"
        {...rest}
      >
      {title}
      </button>
  );
}

export default Button;