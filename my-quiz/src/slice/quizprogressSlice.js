import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Quizprogressapi = createApi({
  reducerPath: " Quizprogress",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }), // Replace with your API base URL
  endpoints: (builder) => ({
    getProgress: builder.query({
      query: ({ quizId, userId }) => ({
        url: `quiz-progress?quizId=${quizId}&userId=${userId}`,
      }),
    }),
    postProgress: builder.mutation({
      query: ({ userId, quizId, questions }) => ({
        url: "quiz-progress",
        method: "POST",
        body: {
          userId: userId,
          quizId: quizId,
          questions: questions?.map((item, index) => ({
            id: index,
            userFlag: item.userFlag,
            userAnswer: item.userAnswer,
            score: item.score,
            question: { text: item.question.text },
            options: item.options,
            attempts: item.attempt,
            totalattempt: 3,
            correct: item.correctAnswer,
          })),
        },
      }),
    }),
    patchProgress: builder.mutation({
      query: ({ id, progressId, questions }) => ({
        url: `quiz-progress/${progressId}/${id}`,
        method: "PATCH",
        body: questions,
      }),
    }),
  }),
});

export const {
  useGetProgressQuery,
  usePostProgressMutation,
  usePatchProgressMutation,
} = Quizprogressapi;
