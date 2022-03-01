import React from 'react';
import './Result.css';

type Props = {
  customer: string;
  test: string;
  result: string;
};

/** Result row */
function ExamResult({
  customer,
  test,
  result,
  ...rest
}: Props): React.ReactElement {

  return (
    <div className="row" {...rest}>
      <div className="column">{customer}</div>
      <div className="column">{test}</div>
      <div className="column">{result}</div>            
    </div>
  );
}

export default ExamResult;