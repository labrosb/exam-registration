import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input from './';

const props = {
  onValueChange: jest.fn(),
  onError: jest.fn(),
  placeholder: "test-input",
  value: "",
  required: true,
  submitted: false,
  reset: false
};

describe('<Base Input>', () => {
  it('should update input', () => {
    const utils = render(<Input {...props} />);
    const input = utils.getByPlaceholderText('test-input');
    // Updating value prop
    const newValue = 'test';
    utils.rerender(<Input {...props} {...{value: newValue}} />);
    // @ts-ignore
    expect(input.value).toBe(newValue);
  });

  it('should trigger onValueChange', () => {
    const utils = render(<Input {...props} />);
    const input = utils.getByPlaceholderText('test-input');

    fireEvent.change(input, {target: {value: 'test'}});
    expect(props.onValueChange).toHaveBeenCalledTimes(1);
  });

  it('should show error on typing', async () => {
    // Setting custom callback function to update the value, similar to how it should be used
    let newValue = '';
    const onValueChange = (v: any) => newValue = v;

    const utils = render(<Input {...props} {...{onValueChange}} />);
    const input = utils.getByPlaceholderText('test-input');
    // Typing (updating prop)
    fireEvent.change(input, {target: { value: 'test'}});
    utils.rerender(<Input {...props} {...{value: newValue}} />);
    // Untyping
    fireEvent.change(input, {target: {value: ''}});
    utils.rerender(<Input {...props} {...{value: newValue}} />);
  
    const errorText = await utils.findByText('The field is required');

    expect(errorText).toBeTruthy();
  });


  it('should show error on submit', () => {
    const utils = render(<Input {...props} />);  
    // Pass submit prop
    utils.rerender(<Input {...props} {...{submitted: true}} />);

    const errorText = utils.getByText('The field is required');

    expect(errorText).toBeTruthy();
  });

});
