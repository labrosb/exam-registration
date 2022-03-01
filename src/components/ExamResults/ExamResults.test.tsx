import React from 'react';
import { createStore } from 'redux';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { testExamResults } from '../../../test-data/examResults';
import examResultsReducer, { ExamResult } from '../../state/examResultsSlice';
import ExamResults from '.';

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

const singleResult = {
  id: 'result-id',
  customer: 'test-customer',
  test: 'test',
  concentration: 4
};

const useSelectorMock: any = reactRedux.useSelector;

const initial = [] as ExamResult[];

const store = createStore(examResultsReducer, initial);
// @ts-ignore
const wrapper = ({ children }) => {
  return(
    <Provider store={store}>{children}</Provider>
  );
};
afterEach(() => jest.clearAllMocks());

describe('<Exam Results List>', () => {
  afterEach(() => useSelectorMock.mockClear());

  it('should render 10 results at a time', () => {
    useSelectorMock.mockImplementation(() => testExamResults);

    const utils = render(<ExamResults />, { wrapper }); 

    const loadMoreButton = utils.getByTestId('load-more-button');
    const firstResults = utils.getAllByTestId('exam-row');
  
    // Clicking one time to retrieve 10 more
    fireEvent.click(loadMoreButton);

    const resultsAfterLoadMore = utils.getAllByTestId('exam-row');
    // Clicking one more time to retrieve the remaining > 10 items
    fireEvent.click(loadMoreButton);

    const resultsAfterLastLoadMore = utils.getAllByTestId('exam-row');

    expect(firstResults).toHaveLength(10);
    expect(resultsAfterLoadMore).toHaveLength(20);
    expect(resultsAfterLastLoadMore).toHaveLength(testExamResults.length);
  });

  it('Should render no results message', () => {
    useSelectorMock.mockImplementation(() => []);

    const utils = render(<ExamResults />, { wrapper }); 

    const noResultsMsg = utils.getByText('No results found.');

    expect(noResultsMsg).toBeTruthy();
  });

  it('Should show result low', () => {
    useSelectorMock.mockImplementation(() => [singleResult]);

    const utils = render(<ExamResults />, { wrapper }); 

    const lowResult = utils.getByText('low');

    expect(lowResult).toBeTruthy();
  });

  it('Should show result normal', () => {
    useSelectorMock.mockImplementation(() => [
      {...singleResult, concentration: 6},
    ]);

    const utils = render(<ExamResults />, { wrapper }); 
    const lowResult = utils.getByText('normal');
    
    expect(lowResult).toBeTruthy();
  });

  it('Should show result high', () => {
    useSelectorMock.mockImplementation(() => [
      {...singleResult, concentration: 15},
    ]);

    const utils = render(<ExamResults />, { wrapper }); 
    const lowResult = utils.getByText('high');
    expect(lowResult).toBeTruthy();
  });

});