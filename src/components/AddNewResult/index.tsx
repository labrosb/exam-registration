import React, { useRef, useState } from 'react';
import { useDispatch } from '../../state/store';
import { addExam } from '../../state/examResultsSlice';
import Header from '../@Common/Header';
import Input from '../@Base/Input';
import Select from '../@Base/Select';
import Button from '../@Base/Button';
import './AddNewResult.css';

type Validation = Record<string, boolean>;

const testNameValues = [
  { label: "Blood", value: "Blood" },
  { label: "Covid PCR", value: "Covid PCR" },
  { label: "Epigenetics", value: "Epigenetics" }
];

/** Form page to add new exam result */
function AddNewResult(): React.ReactElement {
  const dispatch = useDispatch();
  // The form validation logic could be turned into a hook if used in more than one place
  const errors = useRef<Validation>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [reset, setReset] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [testName, setTestName] = useState('');
  const [testConcentration, setTestConcentration] = useState('');

  const setError = (newError: Validation) => {
    errors.current = { ...errors.current, ...newError };
  };

  const hasError = () => Object.values(errors.current).includes(true);

  const clearInputs = () => {
    setReset(true);
    setCustomerName('');
    setTestName('');
    setTestConcentration('');
  };

  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>):void => {

    ev.preventDefault();
    // Setting submitting flag
    setSubmitting(true);
    // Reseting previous submit info
    setSubmitDone(false);
    setSubmitError(false);
    setValidationError(false);
    try {
      if (!hasError()) {
        // Add exam to state
        dispatch(addExam({
          customer: customerName,
          test: testName,
          concentration: testConcentration
        }));
        // Clear inputs if submitted successfully
        clearInputs();
      } else {
        setValidationError(true);
      }
    } catch (e) {
      console.warn(e);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
      setSubmitDone(true);
    }
  };

  return (
    <>
      <Header title="New Result" />
      <form
        className="new-result-form"
        onSubmit={handleFormSubmit}
      >
        <Input
          placeholder="Customer name"
          value={customerName}
          onValueChange={setCustomerName}
          onError={setError}
          submitted={submitDone}
          required
          {...{ reset }}
        />
        <Select
          data-testid="test-name-select"
          title="Test name"
          options={testNameValues}
          value={testName}
          onChange={setTestName}
          onError={setError}
          submitted={submitDone}
          required
          {...{ reset }}
        />
        <Input
          placeholder="Test concentration (umol/L)"
          value={testConcentration}
          type="number"
          onValueChange={setTestConcentration}
          onError={setError}
          submitted={submitDone}
          required
          {...{ reset }}
        />
        <Button
          data-testid="submit-exam-button"
          title="Submit"
          disabled={submitting}
        />
        {submitDone && !validationError && !submitError &&
          <p className="success-message">
            Submitted sucessfully!
          </p>
        }
        {submitError &&
          <p className="success-error">
            Failed. Please try again!
          </p>
        }
      </form>
    </>
  );
}

export default AddNewResult;