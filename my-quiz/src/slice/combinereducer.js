import { combineReducers } from "@reduxjs/toolkit";
import { Questionapi } from "./questionslice";
import quizreducerslice from "./quizreducerslice";

import { Quizprogressapi } from "./quizprogressSlice";

const rootreducer = combineReducers({
  [Questionapi.reducerPath]: Questionapi.reducer,
  quiz: quizreducerslice,
  [Quizprogressapi.reducerPath]: Quizprogressapi.reducer,
});

export default rootreducer;
