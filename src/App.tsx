import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { store, persistor } from './state/store';
import AddNewResult from './components/AddNewResult';
import ExamResults from './components/ExamResults';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router>
          <Routes>
            <Route
              path="/add-exam-results"
              element={<AddNewResult />}
            />
            <Route
              path="/exam-results"
              element={<ExamResults />}
            />
            <Route
              path="*"
              element={<Navigate to="/add-exam-results" replace />}
            />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
