import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: 0,
  quizId: 0,
  questions: [],
  createdAt: "",
  id: 0,
  updatedAt: "",
};

const quizreducerslice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setter(state, { payload }) {
      return { ...state.quiz, ...payload };
    },
    answerFun(state, { payload }) {
      let { answer, id } = payload;

      const existingQues = state.questions.find(
        (question) => question.id === id
      );
      existingQues.userAnswer.push(answer);
    },
    flagFun(state, { payload }) {
      const { id } = payload;
      const existingQues = state.questions.find(
        (question) => question.id === id
      );
      if (existingQues) {
        existingQues.userFlag = !existingQues.userFlag;
      }
    },

    attemptFun(state, { payload }) {
      let { id } = payload;

      const existingQues = state.questions.find(
        (question) => question.id === id
      );
      if (existingQues) {
        existingQues.attempts = existingQues.attempts - 1;
      }
    },
    scoreFun(state, { payload }) {
      const { id } = payload;
      const existingQues = state.questions.find(
        (question) => question.id === id
      );
      if (existingQues) {
        existingQues.score = 1;
      }
    },
  },
});

export const { setter, answerFun, flagFun, attemptFun, scoreFun, optionsFun } =
  quizreducerslice.actions;
export const quizSelector = (state) => state.quiz;
export default quizreducerslice.reducer;
