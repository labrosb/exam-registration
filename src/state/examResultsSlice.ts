import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

export type ExamResult = {
  id: string;
  customer: string;
  test: string;
  concentration: number;
};

const initialState = [] as ExamResult[];

const examResultsSlice = createSlice({
  name: "examResults",
  initialState,
  reducers: {
    addExam: (state, action) => {
      const id = uuid();
      state.push({ id, ...action.payload });
    },
  },
});

export const { addExam } = examResultsSlice.actions;
export default examResultsSlice.reducer;
