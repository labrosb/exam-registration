import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import examResultsReducer, { ExamResult } from '../../state/examResultsSlice';
import AddNewResult from '.';

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => jest.fn(),
}));

const initialState = [] as ExamResult[];

const store = createStore(examResultsReducer, initialState);
// @ts-ignore
const wrapper = ({ children }) => (
	<Provider store={store}>{children}</Provider>
);

afterEach(() => jest.clearAllMocks());

describe('<Add New Result>', () => {
  it('should show error on typing', () => {
    const utils = render(<AddNewResult />, { wrapper }); 
    const customerNameInput = utils.getByPlaceholderText('Customer name');
    const concentrationInput = utils.getByPlaceholderText('Test concentration (umol/L)');
    // Typing
    fireEvent.change(customerNameInput, {target: {value: 'test customer name'}});
    fireEvent.change(concentrationInput, {target: {value: 'test concentration'}});
    // Untyping
    fireEvent.change(customerNameInput, {target: {value: ''}});
    fireEvent.change(concentrationInput, {target: {value: ''}});

    const errorText = utils.getByText('The field is required');

    expect(errorText).toBeTruthy();
  });

  it('should show errors on submit', () => {
    const utils = render(<AddNewResult />, { wrapper });  
    const submitButton = utils.getByTestId('submit-exam-button');
    // Click submit button
    fireEvent.click(submitButton);

    const errorText = utils.getAllByText('The field is required');

    expect(errorText).toHaveLength(3);
  });

  it('should submit value to state correctly and render success message', async () => {
    const utils = render(<AddNewResult />, { wrapper });

    const customerNameVal = 'test customer name';
    const concentrationInputVal = '10';
    const testNameInputVal = 'Epigenetics';
  
    const customerNameInput = utils.getByPlaceholderText('Customer name');
    const concentrationInput = utils.getByPlaceholderText('Test concentration (umol/L)');
    const testNameInput = utils.getByTestId('test-name-select');
    const submitButton = utils.getByTestId('submit-exam-button');
    // Typing
    fireEvent.change(customerNameInput, {target: {value: customerNameVal}});
    fireEvent.change(concentrationInput, {target: {value: concentrationInputVal}});
    // Selecting
    fireEvent.change(testNameInput, {target: {value: testNameInputVal}});
    // Click submit button
    fireEvent.click(submitButton);

    const submittedText = await utils.findByText('Submitted sucessfully!');
    
    const newState = store.getState();

    expect(newState[0].id).toBeTruthy();
    expect(newState[0].customer).toEqual(customerNameVal);
    expect(newState[0].test).toEqual(testNameInputVal);
    expect(newState[0].concentration).toEqual(concentrationInputVal);

    expect(submittedText).toBeTruthy();
  });

});