import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export const Questionapi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://the-trivia-api.com/v2/" }), // Replace with your API base URL
  endpoints: (builder) => ({
    getQuestion: builder.query({
      query: () => "questions", // Replace with your API endpoint for fetching todos
      providesTags: ["Question"],
      transformResponse: (response, _meta, args) => {
        console.log("asasa", _meta);
        console.log(">>>response", response);

        let { userId, quizId } = args;
        console.log(">>>args", args);
        return {
          userId: userId,
          quizId: quizId,
          questions: response?.map((q, id) => {
            const { correctAnswer, incorrectAnswers } = q;
            const options = [...incorrectAnswers];
            const data = options.map((data, index) => ({
              value: data,
              correct: false,
            }));
            data.push({
              value: correctAnswer,
              correct: true,
            });
            let d = {
              ...q,
              options: shuffleArray(data),
              userFlag: false,
              userAnswer: [],
              attempt: 3,
              score: 0,
              id: id,
            };
            return d;
          }),
        };
      },
    }),
  }),
});

export const { useGetQuestionQuery } = Questionapi;
