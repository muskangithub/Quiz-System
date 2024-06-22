import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetQuestionQuery } from "../slice/questionslice";
import {
  useGetProgressQuery,
  usePostProgressMutation,
  usePatchProgressMutation,
} from "../slice/quizprogressSlice";
import {
  setter,
  answerFun,
  flagFun,
  attemptFun,
  scoreFun,
} from "../slice/quizreducerslice";

export default function Listnew2() {
  const quizId = 208;
  const userId = 1;
  const dispatch = useDispatch();

  const {
    data: progressData,
    isFetching: progressIsFetching,
    isLoading: progressIsLoading,
    isSuccess: progressIsSuccess,
    isUninitialized,
    fulfilledTimeStamp,
  } = useGetProgressQuery({ quizId, userId });

  const [postProgress] = usePostProgressMutation();
  const [patchProgress] = usePatchProgressMutation();

  const skipNext =
    fulfilledTimeStamp !== undefined
      ? Object.keys(progressData).length !== 0
      : true;

  const {
    data: questionlist,
    isLoading: questionIsLoading,
    isFetching: questionIsFetching,
    isSuccess,
    fulfilledTimeStamp: full,
  } = useGetQuestionQuery(
    { userId, quizId },
    {
      skip: skipNext,
    }
  );
  if (!questionIsLoading) {
    console.log(questionlist, "questionlist", progressData);
  }

  useEffect(() => {
    const daa = async () => {
      try {
        if (questionlist) {
          const payload = await postProgress(questionlist).unwrap();
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (questionlist) {
      daa();
    }
  }, [questionlist]);

  useEffect(() => {
    if (
      progressData &&
      progressIsSuccess &&
      Object.keys(progressData).length > 0
    ) {
      console.log(progressData, "hlooo");
      dispatch(setter(progressData));
    } else if (questionlist && isSuccess) {
      console.log(questionlist, "pa");
      dispatch(setter(questionlist));
    }
  }, [questionlist, progressData]);

  const [currentindex, setCurrentindex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [show, setShow] = useState(false);
  let data = useSelector((state) => state.quiz);
  // console.log(data, "dtatatat", currentindex, data.questions);

  const HandleSubmission = () => {
    console.log(progressData, "currentindex");
    dispatch(
      answerFun({
        id: data.questions[currentindex].id,
        answer: answer,
      })
    );

    if (
      (data.questions[currentindex].userAnswer?.length === 0 &&
        answer === "") ||
      answer === undefined
    ) {
      alert("attempt first");
    } else if (answer === data.questions[currentindex].correct) {
      alert("correct");
      dispatch(
        attemptFun({
          id: data.questions[currentindex].id,
        })
      );
      dispatch(
        scoreFun({
          id: data.questions[currentindex].id,
        })
      );
      if (currentindex === 9) {
        setCurrentindex(currentindex);
      } else {
        setCurrentindex(currentindex + 1);
      }
    } else {
      dispatch(
        attemptFun({
          id: data.questions[currentindex].id,
        })
      );

      alert("false");
    }
    if (data.questions[currentindex].attempts <= 1) {
      alert("all attempts used");
      if (currentindex === 9) {
        setCurrentindex(currentindex);
      } else {
        setCurrentindex(currentindex + 1);
      }
    }
    patchProgress({
      id: currentindex,
      progressId: progressData.id,
      questions: data.questions[currentindex],
    });
  };

  const handleOptionChange = (e) => {
    setAnswer(e.target.value);
  };

  const flag = () => {
    dispatch(
      flagFun({
        id: data.questions[currentindex].id,
      })
    );
  };

  const currentQ = data?.questions?.find((q) => q.id === currentindex);

  // console.log(currentQ, "currents");
  console.log(answer, "answer");

  return progressIsLoading || (questionIsLoading && !data) ? (
    <p>loading</p>
  ) : (
    <div>
      <div className="quiz-btn flex gap-[10px] justify-center border-[1px] p-3 mt-[100px] mx-auto w-[900px] bg-zinc-400">
        {data?.questions &&
          data?.questions?.map((item, index) => (
            <button
              key={index}
              className={`btn p-3 border-[1px] rounded-lg text-white ${
                item[index] === item[currentindex] &&
                item[index]?.attempts === 3 &&
                item[index]?.userFlag === false
                  ? "bg-blue-200"
                  : "bg-blue-500"
              } ${
                item[index]?.userFlag === true ? "bg-yellow-500" : "bg-blue-500"
              } ${item[index]?.score === 1 ? "bg-green-500 " : "bg-blue-500"} ${
                item[index]?.score === 0 && item[index]?.attempts < 3
                  ? "bg-red-500 "
                  : "bg-blue-500"
              }`}
              onClick={() => {
                setCurrentindex(index);
                setAnswer(
                  data.questions[index]?.userAnswer[
                    data.questions[index].userAnswer.length - 1
                  ]
                );
              }}
            >
              {index + 1}
            </button>
          ))}
      </div>
      {currentQ && (
        <div className="mx-auto bg-slate-400 w-[700px] h-[450px] border-[1px] rounded-[12px] mt-[15px]">
          <div className=" mt-[15px] flex flex-col gap-[10px]">
            <div className="mt-[15px] flex p-3 justify-between ">
              <span className="text-[35px] ml-[10px]">
                question {currentindex + 1}
              </span>
              <button
                className={` p-3 border-[1px] rounded-lg ${
                  currentQ.userFlag === true
                    ? "bg-yellow-500 "
                    : "bg-orange-500"
                } `}
                onClick={flag}
                disabled={currentQ.score === 1 || currentQ.attempts === 0}
              >
                flag
              </button>
            </div>
            <p className="ml-[10px] text-[17px]">{currentQ.question.text}</p>
            <div className="text-orange-300 text-[18px] mx-auto">
              Attempts left {currentQ.attempts}
            </div>
            <div className="text-orange-300 text-[18px] mx-auto">
              {currentQ.score}
            </div>
            <div>
              {currentQ.options?.map((item, index) => (
                <div
                  className=" flex flex-row gap-[20px] ml-[10px] disabled:bg-green-500"
                  key={index}
                >
                  <input
                    type="radio"
                    value={item.value}
                    onChange={handleOptionChange}
                    checked={
                      answer === item.value ||
                      item.value ===
                        progressData.questions[currentindex].userAnswer[
                          progressData.questions[currentindex].userAnswer
                            .length - 1
                        ]
                    }
                    disabled={
                      currentQ.score === 1 ||
                      currentQ.attempts <= 0 ||
                      currentQ.userFlag === true
                    }
                  />
                  <label>{item.value}</label>
                </div>
              ))}
            </div>
          </div>

          <button
            className=" p-3 mt-[15px] ml-[300px] border-[2px] rounded-[12px]  text-white bg-blue-500 disabled:bg-gray-400"
            onClick={HandleSubmission}
            disabled={
              currentQ.userFlag === true ||
              currentQ.score === 1 ||
              currentQ.attempts <= 0
            }
          >
            check
          </button>

          <button
            onClick={() => setShow(true)}
            className={`${
              currentindex === data?.questions.length - 1
                ? "  p-3 bg-purple-400 border-2 border-white rounded-lg float-right mr-[10px] mt-[20px]"
                : "hidden"
            }`}
          >
            Submit
          </button>
        </div>
      )}
      {show && <div>1234568899987654</div>}
    </div>
  );
}
