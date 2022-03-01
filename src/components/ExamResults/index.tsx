import React, { useState } from 'react';
import { useSelector } from '../../state/store';
import { ExamResult } from '../../state/examResultsSlice';
import getConcentration from '../../utils/getConcentration';
import Header from '../@Common/Header';
import Button from '../@Base/Button';
import Result from './Result';
import './ExamResults.css';

const itemsToLoad = 10;
/** List of exam results */
function ExamResults(): React.ReactElement {
  const exams = useSelector((state) => state.examResults) || [];

  const [visibleExams, setVisibleExams] = useState(() => exams.slice(0, itemsToLoad));

  const handleLoadMore = () => {
    // If the remaining results are equal or more to the ones that will attempt to load
    if (visibleExams.length + itemsToLoad <= exams.length) {
      const newResults = exams.slice(0, visibleExams.length + itemsToLoad);
      setVisibleExams(newResults);
    // Otherwise, if there are few results remaining (less than itemsToLoad)
    } else {
      setVisibleExams(exams);
    }
  };

  const hasMoreResults = exams.length > visibleExams.length;

  if (exams.length === 0) {
    return (
      <>
        <Header title="Examination Results" />
        <p className="no-results"> No results found. </p>
      </>
    );
  }

  return (
    <>
      <Header title="Examination Results" />
      <div className="results-container">
        <Result
          key="exams-header"
          customer="Customer Name"
          test="Test"
          result="Result"
        />
        {visibleExams.map((exam: ExamResult) => (
          <Result
            data-testid="exam-row"
            key={exam.id}
            customer={exam.customer}
            test={exam.test}
            result={getConcentration(exam.concentration)}
          />
          /* The calculation has not significant complexity,
            however if we want optimal performance, we can pre-calculate
            the getConcentration in a parent component or in the state
          */
        ))}
        <Button
          data-testid="load-more-button"
          disabled={!hasMoreResults}
          title={hasMoreResults ? 'Load more' : 'No more results'}
          onClick={handleLoadMore}
        />
      </div>
    </>
  );
}

export default ExamResults;