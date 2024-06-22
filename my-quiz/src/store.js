import { configureStore } from "@reduxjs/toolkit";
import rootreducer from "./slice/combinereducer";
import { Questionapi } from "./slice/questionslice";
import { Quizprogressapi } from "./slice/quizprogressSlice";

export const store = configureStore({
  reducer: rootreducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      Questionapi.middleware,
      Quizprogressapi.middleware
    ),
});
