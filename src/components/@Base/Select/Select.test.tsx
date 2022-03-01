import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Select from '.';

const options = [
  { label: "Test-1", value: "value-1" },
  { label: "Test-2", value: "value-2" },
  { label: "Test-3", value: "value-3" }
];

const title = 'Test-title';

const props = {
  "data-testid": "base-select",
  title: title,
  options,
  value: "",
  required: true,
  submitted: false,
  reset: false,
  onChange: jest.fn(),
  onError: jest.fn(),
};

describe('<Base Select>', () => {
  it('should update input', () => {
    const utils = render(<Select {...props} />);
    const input = utils.getByTestId('base-select');
    // Updating value prop
    const newValue = 'value-2';
    utils.rerender(<Select {...props} {...{value: newValue}} />);
    // @ts-ignore
    expect(input.value).toBe(newValue);
  });

  it('should show select title', () => {
    const utils = render(<Select {...props} />);

    utils.rerender(<Select {...props} />);
    const selectTitle = utils.getByText(title);

    expect(selectTitle).toBeTruthy();
  });

  it('should trigger onChange', () => {
    const utils = render(<Select {...props} />);
    const input = utils.getByTestId('base-select');

    fireEvent.change(input, {target: {value: 'test'}});
    expect(props.onChange).toHaveBeenCalledTimes(1);
  });

  it('should show error on submit', () => {
    const utils = render(<Select {...props} />);
    // Pass submit prop
    utils.rerender(<Select {...props} {...{submitted: true}} />);

    const errorText = utils.getByText('The field is required');

    expect(errorText).toBeTruthy();
  });

});
