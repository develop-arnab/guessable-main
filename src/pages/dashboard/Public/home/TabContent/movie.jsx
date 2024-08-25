/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { FaFire } from "react-icons/fa";
import { SlCheck, SlClose } from "react-icons/sl";
import CustomSelect from "../../../../../components/Select";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { setSelectOptions } from "../../../../../formik/validationSchema";
import { Notification } from "../../../../../components/ToastNotification";
import copy from "clipboard-copy";
import { IoLockOpen, IoLockClosed } from "react-icons/io5";
import {
  useGetAllMoviesQuery,
  useGetQuestionStateQuery,
  useGetUserStreakQuery,
  useMakeAttemptForUnregisteredUserMutation,
  useMakeAttemptMutation,
  useMakeOldQuestionAttemptMutation,
} from "../../../../../services/auth";
import { Progress } from "antd";
import ConfettiExplosion from "react-confetti-explosion";
import Lottie from "react-lottie";
import fire from "../../../../../../public/assets/Fire.json";
import lose from "../../../../../../public/assets/lose.json";
import moment from "moment";
import { useAuth0 } from "@auth0/auth0-react";

const TabContent = ({ question, boolUserSelectedDate, isLoading }) => {
  const [initialValues] = useState({ option: "" });
  const [isExploding, setIsExploding] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [makeAttemptForUnregisteredUser, { isLoading: loadingUnAth }] =
    useMakeAttemptForUnregisteredUserMutation();
  const [makeAttempt, { isLoading: loadingAuth }] = useMakeAttemptMutation();
  const [makeOldAttempt, { isLoading: loadingOldAttempts }] =
    useMakeOldQuestionAttemptMutation();
  
  const [userStreak, setUserStreak] = useState(-1);
  const { data, error, status, refetch } = useGetUserStreakQuery();

  
  console.log(userStreak);
  if (status === "fulfilled" && userStreak === -1) {
  setUserStreak(data?.movieStreak || 0);
  }
  const getLatestStreakFromDB = async () => {
  const { data } = await refetch();
  setUserStreak(data?.movieStreak);
  };

 

  const [currentAttempt, setCurrentAttempt] = useState({
    quesID: question?.id,
    attemptValue: 0,
    isCorrect: false,
  });
  
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [questionClues, setQuestionClues] = useState([]);
  const [option, setOption] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [clueMainAfter, setClueMainAfter] = useState("");
  const [streak, setStreak] = useState(
    localStorage.getItem("movieStreak") || 0
  );
  
  const [allAnswers, setAllAnswers] = useState(
    (Array.isArray(
      JSON.parse(localStorage.getItem(`answers-${question?.id}`)),
    ) &&
      JSON.parse(localStorage.getItem(`answers-${question?.id}`))) ||
      [],
  );
  const [lostStreak, setLostStreak] = useState(false);
  const [questionStats, setQuestionStats] = useState([0, 0, 0, 0]);
  const { data: stats, refetch: refetchStats } = useGetQuestionStateQuery({
    quesId: question?.id,
  });
  // useEffect(() => {
  //   if (stats?.response) {
  //     const updatedStats = Object.values(stats.response).map((value) =>
  //       Math.round(parseFloat(value.replace("%", ""))),
  //     );
  //     setQuestionStats(updatedStats);
  //   }
  // }, [stats]);

  useEffect(() => {
    console.log("stats ", stats);
    if (stats?.response) {
      const updatedStats = Object.entries(stats.response)
        .filter(
          ([key, value]) => key !== "totalAttempts" && typeof value === "string"
        ) // Exclude totalAttempts and ensure value is a string
        .map(([, value]) => Math.round(parseFloat(value.replace("%", ""))));
      setQuestionStats(updatedStats);
    }
  }, [stats]);
  
  const { data: allMovies } = useGetAllMoviesQuery();

  useEffect(() => {
    const uniqueArray = Array.from(
      new Set(allMovies?.map((obj) => JSON.stringify(obj))),
    ).map((str) => JSON.parse(str));
    const processedOptions =
      (Array.isArray(uniqueArray) &&
        uniqueArray.length > 0 &&
        uniqueArray.map((option) => ({
          ...option,
          disabled: allAnswers?.includes(option.value),
          key: Math.random(),
        }))) ||
      [];

    setOption(processedOptions);
  }, [allMovies, allAnswers]);

  const oldQuestionAttempts =
    JSON.parse(localStorage.getItem("oldMovieQuestionAttempts")) || [];
  const attempts = JSON.parse(localStorage.getItem("movieAttempts")) || [];
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: setSelectOptions,
    onSubmit: async (values, { resetForm }) => {
      console.log("onSubmit", values.option);
      const token = !!localStorage.getItem("token");
      if (boolUserSelectedDate) {
        try {
            const newAttemptObj = {
              quesID: question?.id,
              attemptValue: 0,
              isCorrect: false,
            };
            const result = await makeOldAttempt({
              attemptDataId: question?.attemptsInfo?.id,
              userID: localStorage.getItem("userID") ?? "auth",
              chooseValue: values.option,
              questionType: "movie"
              // attemptData: newAttemptObj
            });

            // newAttemptObj.attemptValue = newAttemptObj.attemptValue + 1;

            if (result?.data) {
               setAllAnswers([...(allAnswers ?? []), values.option]);
              if (result?.data?.isCorrect === false) {
              setCurrentAttempt({
                quesID: question?.id,
                attemptValue: result?.data?.attemptNumber,
                isCorrect: result?.data?.isCorrect
              });
              if (result?.data?.clueOne?.releaseYear) {
                  setQuestionClues([result?.data?.clueOne?.releaseYear]);
                }
              if (result?.data?.clueTwo?.cast) {
                  setQuestionClues([
                    ...questionClues,
                    result?.data?.clueTwo?.cast
                  ]);
                  
                } else if (result?.data?.clueThree?.director) {
                  setQuestionClues([
                    ...questionClues,
                    result?.data?.clueThree?.director
                  ]);
                }
                if (result?.data?.answer) {
                  setCorrectAnswer(result?.data?.answer);
                  setClueMainAfter(result?.data?.clueMainAfter);
                }
              } else {
                const updatedArray = [
                  result?.data?.clueOne?.releaseYear,
                  result?.data?.clueTwo?.cast,
                  result?.data?.clueThree?.director,
                ];
                setQuestionClues(updatedArray);

                setCorrectAnswer(result?.data?.answer);
                setClueMainAfter(result?.data?.clueMainAfter);
                setCurrentAttempt({
                  quesID: question?.id,
                  attemptValue: result?.data?.attemptNumber,
                  isCorrect: result?.data?.isCorrect
                });
                const filteredAnswers = result?.data?.allResponses.filter(
                  (element) => element !== null
                );
                setAllAnswers(filteredAnswers);
                setShowConfetti(true);
              }
              resetForm();
              refetchStats();
            }
        } catch (e) {
          console.log("error", e);
        }
      } else {
        if (!token) {
          console.log(" else - if(!token) - no token");
          try {
              console.log("if (!attemptFound) {");
              const newAttemptObj = {
                quesID: question?.id,
                attemptValue: 0,
                isCorrect: false,
              };
              const result = await makeAttemptForUnregisteredUser({
                userID: localStorage.getItem("userID"),
                attemptDataId: question?.attemptsInfo?.id,
                chooseValue: values.option,
                questionType: "movie",
                attemptData: newAttemptObj
              });

              newAttemptObj.attemptValue = 1;

              if (result?.data) {
               setAllAnswers([...(allAnswers ?? []), values.option]);
               if (result?.data?.isCorrect === false) {
                 setCurrentAttempt({
                   quesID: question?.id,
                   attemptValue: result?.data?.attemptNumber,
                   isCorrect: result?.data?.isCorrect
                 });
                 if (result?.data?.clueOne?.releaseYear) {
                   setQuestionClues([result?.data?.clueOne?.releaseYear]);
                 }
                 if (result?.data?.clueTwo?.cast) {
                   setQuestionClues([
                     ...questionClues,
                     result?.data?.clueTwo?.cast
                   ]);
                 } else if (result?.data?.clueThree?.director) {
                   setQuestionClues([
                     ...questionClues,
                     result?.data?.clueThree?.director
                   ]);
                 }
                 if (result?.data?.answer) {
                  localStorage.setItem("lastDatePlayed-movie", question?.date);
                   setCorrectAnswer(result?.data?.answer);
                   setClueMainAfter(result?.data?.clueMainAfter);
                   setStreak(calculateStreak("reset"));
                 }
               } else {
                  localStorage.setItem("lastDatePlayed-movie", question?.date);
                 const updatedArray = [
                   result?.data?.clueOne?.releaseYear,
                   result?.data?.clueTwo?.cast,
                   result?.data?.clueThree?.director
                 ];
                 setQuestionClues(updatedArray);

                 setCorrectAnswer(result?.data?.answer);
                 setClueMainAfter(result?.data?.clueMainAfter);
                 setCurrentAttempt({
                   quesID: question?.id,
                   attemptValue: result?.data?.attemptNumber,
                   isCorrect: result?.data?.isCorrect
                 });
                 const filteredAnswers = result?.data?.allResponses.filter(
                   (element) => element !== null
                 );
                 setAllAnswers(filteredAnswers);
                 setStreak(calculateStreak("increament"));
                 setShowConfetti(true);
               }
                resetForm();
                refetchStats();
              }
            

            localStorage.setItem("movieAttempts", JSON.stringify(attempts));
          } catch (e) {
            console.log("error", e);
          }
        } else {
          console.log(" if else if else - token");
          try {
            const result = await makeAttempt({
              attemptDataId: question?.attemptsInfo?.id,
              chooseValue: values.option,
              questionType: "movie",
            });

            if (result?.data) {
              setAllAnswers([...(allAnswers ?? []), values.option]);
                if (result?.data?.isCorrect === false) {
                  setCurrentAttempt({
                    quesID: question?.id,
                    attemptValue: result?.data?.attemptNumber,
                    isCorrect: result?.data?.isCorrect
                  });
                  if (result?.data?.clueOne?.releaseYear) {
                    setQuestionClues([
                      result?.data?.clueOne?.releaseYear
                    ]);
                  }
                  if (result?.data?.clueTwo?.cast) {
                    setQuestionClues([
                      ...questionClues,
                      result?.data?.clueTwo?.cast,
                    ]);
                  } else if (result?.data?.clueThree?.director) {
                    setQuestionClues([
                      ...questionClues,
                      result?.data?.clueThree?.director,
                    ]);
                  }
                  if (result?.data?.answer) {
                    setCorrectAnswer(result?.data?.answer);
                    setClueMainAfter(result?.data?.clueMainAfter);
                  }
                } else {
                  const updatedArray = [
                    result?.data?.clueOne?.releaseYear,
                    result?.data?.clueTwo?.cast,
                    result?.data?.clueThree?.director,
                  ];
                  setQuestionClues(updatedArray);
                  setCorrectAnswer(result?.data?.answer);
                  setClueMainAfter(result?.data?.clueMainAfter); 
                  setCurrentAttempt({
                    quesID: question?.id,
                    attemptValue: result?.data?.attemptNumber,
                    isCorrect: result?.data?.isCorrect
                  });
                  const filteredAnswers = result?.data?.allResponses.filter(
                    (element) => element !== null
                  );
                  setAllAnswers(filteredAnswers);    
                  setStreak(calculateStreak("increament"));
                  setIsExploding(true);
                }
                getLatestStreakFromDB();
                resetForm();
                refetchStats();
              
            } else {
              Notification("Attempts limit reached", "error");
              resetForm();
              refetchStats();
            }
          } catch (e) {
            console.log("error", e);
            Notification(e?.message, "error");
          }
        }
      }
    },
  });

  // useEffect(() => {
  //   const allClues =
  //     JSON.parse(localStorage.getItem(`question-${question?.id}-clues`)) || [];

  //   const allAnswers =
  //     JSON.parse(localStorage.getItem(`answers-${question?.id}`)) || [];

  //   const correctAnswer = localStorage.getItem(
  //     `correct_Answer-${question?.id}`,
  //   );

  //   const clueMainAfterLocal = localStorage.getItem(
  //     `clueMainAfter-${question?.id}`,
  //   );

  //   setCorrectAnswer(correctAnswer);
  //   setClueMainAfter(clueMainAfterLocal);
  //   setQuestionClues(allClues);
  //   setAllAnswers(allAnswers);
  // }, [question?.id]);

      useEffect(() => {
        if (question?.attemptsInfo) {
          const {
            attemptValue,
            maxAttempts,
            isCorrect,
            clueOne,
            clueTwo,
            clueThree
          } = question.attemptsInfo;
          console.log(
            "LOGGED IN QUES ",
            attemptValue,
            maxAttempts,
            isCorrect,
            clueOne,
            clueTwo,
            clueThree
          );
          if (isCorrect || attemptValue >= maxAttempts) {
            const clues = [];
            if (clueOne) clues.push(clueOne.Year);
            if (clueTwo) clues.push(clueTwo.Director);
            if (clueThree) clues.push(clueThree.Cast);
            console.log("LOGGED IN allResponses ", question?.allResponses);
            setQuestionClues(clues);
            setCorrectAnswer(question?.answer);
            setClueMainAfter(question?.clueMainAfter);
            const filteredAnswers = question?.allResponses.filter(
              (element) => element !== null
            );
            setAllAnswers(filteredAnswers);
            setCurrentAttempt({
              // ...currentAttempt,
              quesID: question?.id,
              attemptValue: attemptValue,
              isCorrect: isCorrect
            });
          } else {
            const clues = [];
            if (clueOne) clues.push(clueOne.Year);
            if (clueTwo) clues.push(clueTwo.Director);
            if (clueThree) clues.push(clueThree.Cast);
            setQuestionClues(clues);
            const filteredAnswers = question?.allResponses?.filter(
              (element) => element !== null
            );
            setAllAnswers(filteredAnswers);
            setCurrentAttempt({
              // ...currentAttempt,
              quesID: question?.id,
              attemptValue: attemptValue,
              isCorrect: isCorrect
            });
          }
        }
      }, [question]);

  const { values, setFieldValue, handleSubmit } = formik;

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const totalAttempts =
  //     JSON.parse(localStorage.getItem("movieAttempts")) || [];
  //   const attempt = totalAttempts.filter((attempt) => {
  //     return attempt.quesID === question?.id;
  //   })[0];
  //   console.log("attempt", attempt);
  //   console.log("totalAttempts", totalAttempts);
  //   if(!token) {
  //     if (totalAttempts.length > 0 && attempt) {
  //     if (attempt) {
  //       setCurrentAttempt({
  //         ...currentAttempt,
  //         attemptValue: attempt?.attemptValue,
  //         isCorrect: attempt?.isCorrect,
  //       });
  //     }
  //   } else {
  //     setCurrentAttempt({
  //       quesID: question?.id,
  //       attemptValue: 0,
  //       isCorrect: false,
  //     });
  //   }}
  //   // setStreak(calculateStreak());
  //   refetchStats();
  // }, [handleSubmit, question?.id]);

  const handleCopyText = (text) => {
    const url = "https://guessable.in/movies";
    copy(`${text} ${url}`).then(() => {
      Notification("You have Coppied text successfully!");
    });
  };

  useEffect(() => {
    console.log("USER Streak FOUND ", userStreak);
    const currentDateFoundInQuestion = question?.date;

    const lastDatePlayedRetrieved = localStorage.getItem("lastDatePlayed-movie");

    if (
      lastDatePlayedRetrieved &&
      moment(lastDatePlayedRetrieved)
        .add(1, "days")
        .isBefore(currentDateFoundInQuestion)
    ) {
      setStreak(0);
      localStorage.setItem("movieStreak", 0);
    }
  }, [user]);

  let token = localStorage.getItem("token");
  function calculateStreak(gameState) {
    const token = localStorage.getItem("token");
    if (token) {
      return userStreak?.movieStreak === null ? 0 : userStreak?.movieStreak;
    } else {
      const currentDateFoundInQuestion = question?.date;
      const lastDatePlayedRetrieved =
        localStorage.getItem("lastDatePlayed-movie") || currentDateFoundInQuestion;
      console.log(lastDatePlayedRetrieved, currentDateFoundInQuestion);
      let streak = localStorage.getItem("movieStreak") || 0;
      console.log("Ran", gameState);

      if (
        moment(currentDateFoundInQuestion).isSame(
          moment(lastDatePlayedRetrieved)
        )
      ) {
        if (gameState === "reset") {
          streak = 0;
          setLostStreak(true);
        } else if (gameState === "increament") {
          streak++;
          setIsExploding(true);
        }
      }
      console.log(lastDatePlayedRetrieved, currentDateFoundInQuestion, streak);
      localStorage.setItem("movieStreak", streak);
      return streak;
    }
  }
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: fire,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const loseOptions = {
    loop: true,
    autoplay: true,
    animationData: lose,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return (
    <>
      {showConfetti && (
        <div
          style={{
            display: "flex",
            translate: "50%",
            position: "absolute",
            left: "50%"
          }}
        >
          <ConfettiExplosion duration={6000} width={1000} />
        </div>
      )}
      {isExploding && (
        <div
          style={{
            display: "flex",
            translate: "50%",
            position: "absolute",
            left: "50%"
          }}
        >
          <ConfettiExplosion duration={6000} width={1000} />
        </div>
      )}
      {!isLoading ? (
        question ? (
          <div className="bg-white p-2 rounded-md text-gray3">
            <div className="flex items-center justify-center font-poppins mt-4">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div
                  className="text-orange1"
                  style={{
                    pointerEvents: "none"
                  }}
                >
                  {!isExploding && <FaFire fontSize={"20px"} />}
                </div>

                <div
                  style={{
                    pointerEvents: "none",
                    margin: "0px 5px 5px 0px"
                  }}
                >
                  {isExploding && (
                    <Lottie
                      options={defaultOptions}
                      height={25}
                      width={25}
                      isStopped={false}
                      // isPaused={false}
                    />
                  )}
                </div>

                <div className="text-[20px] font-[700] font-poppins">
                  <span>
                    {" "}
                    {token ? (userStreak > 0 ? userStreak : 0) : streak}
                  </span>{" "}
                  {token
                    ? userStreak > 1
                      ? "Days"
                      : "Day"
                    : streak !== 1
                    ? "Days"
                    : "Day"}{" "}
                  Streak
                </div>
              </div>
            </div>
            <div className="text-center text-[20px] font-[700] mt-4 font-poppins">
              Guess the Hollywood movie based on this clue
            </div>
            <div className="text-justify px-[5%] font-poppins mt-3">
              {currentAttempt?.isCorrect || currentAttempt?.attemptValue >= 4
                ? clueMainAfter
                : question?.clueMainBefore}
            </div>
            {question?.clueImage && (
              <div className="mt-5 w-[95%] overflow-auto rounded-md mx-3 flex justify-center items-center">
                <img src={`${question?.clueImage}`} alt="" />
              </div>
            )}
            <div className="grid grid-cols-3 font-[600] font-poppins">
              <button
                className={`flex gap-2 flex-col justify-center items-center mt-6 ${
                  currentAttempt?.attemptValue > 0 || currentAttempt?.isCorrect
                    ? "text-lightGreen"
                    : "text-lightRed"
                } `}
              >
                <div className="text-[27px]">
                  {currentAttempt?.attemptValue > 0 ||
                  currentAttempt?.isCorrect ? (
                    <IoLockOpen />
                  ) : (
                    <IoLockClosed />
                  )}
                </div>
              </button>
              <button
                className={`flex gap-2 flex-col justify-center items-center mt-6 ${
                  currentAttempt?.attemptValue > 1 || currentAttempt?.isCorrect
                    ? "text-lightGreen"
                    : "text-lightRed"
                } `}
              >
                <div className="text-[27px]">
                  {currentAttempt?.attemptValue > 1 ||
                  currentAttempt?.isCorrect ? (
                    <IoLockOpen />
                  ) : (
                    <IoLockClosed />
                  )}
                </div>
              </button>
              <button
                className={`flex gap-2 flex-col justify-center items-center mt-6 ${
                  currentAttempt?.attemptValue > 2 || currentAttempt?.isCorrect
                    ? "text-lightGreen"
                    : "text-lightRed"
                } `}
              >
                <div className="text-[27px]">
                  {currentAttempt?.attemptValue > 2 ||
                  currentAttempt?.isCorrect ? (
                    <IoLockOpen />
                  ) : (
                    <IoLockClosed />
                  )}
                </div>
              </button>
            </div>
            <div className="grid grid-cols-3 font-[600] font-poppins">
              <button
                className={`flex gap-2  justify-center items-start mt-1 ${
                  currentAttempt?.attemptValue > 0 || currentAttempt?.isCorrect
                    ? "text-lightGreen"
                    : "text-lightRed"
                } `}
              >
                {currentAttempt?.attemptValue > 0 ||
                currentAttempt?.isCorrect ? (
                  <div>
                    <div>{questionClues?.[0]}</div>
                    <div>Release Year</div>
                  </div>
                ) : (
                  <div>Release Year</div>
                )}
              </button>
              <button
                className={`flex gap-2 justify-center items-start mt-1 ${
                  currentAttempt?.attemptValue > 1 || currentAttempt?.isCorrect
                    ? "text-lightGreen"
                    : "text-lightRed"
                } `}
              >
                {currentAttempt?.attemptValue > 1 ||
                currentAttempt?.isCorrect ? (
                  <div>
                    {Array.isArray(questionClues?.[1]) ? (
                      questionClues?.[1]?.map((el, i) => {
                        return <div key={i}>{el}</div>;
                      })
                    ) : (
                      <div>
                        <div>{questionClues?.[1]}</div>
                        <div>Cast</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>Cast</div>
                )}
              </button>
              <button
                className={`flex gap-2 justify-center items-start mt-1 ${
                  currentAttempt?.attemptValue > 2 || currentAttempt?.isCorrect
                    ? "text-lightGreen"
                    : "text-lightRed"
                } `}
              >
                {currentAttempt?.attemptValue > 2 ||
                currentAttempt?.isCorrect ? (
                  <div>
                    <div>{questionClues?.[2]}</div>
                    <div>Director</div>
                  </div>
                ) : (
                  <div>Director</div>
                )}
              </button>
            </div>
            {currentAttempt?.isCorrect || currentAttempt?.attemptValue >= 4 ? (
              <div className="mt-[50px] text-center">
                <div className="text-[15px] font-poppins  font-light">
                  {currentAttempt?.isCorrect
                    ? "You Got It!"
                    : "The Answer Was:"}
                </div>
                <div className="text-[20px] mt-[10px] font-poppins  font-semibold">
                  {correctAnswer}
                </div>
                <div className="flex  justify-center items-center mt-[10px]">
                  <div className="flex gap-2">
                    <div
                      className={`w-[10px] h-[10px] ${
                        currentAttempt?.attemptValue >= 1
                          ? currentAttempt?.attemptValue === 1
                            ? currentAttempt?.isCorrect
                              ? "bg-lightGreen3"
                              : "bg-lightRed2"
                            : "bg-lightRed2"
                          : "bg-lightRed2"
                      }`}
                    ></div>
                    <div
                      className={`w-[10px] h-[10px] ${
                        currentAttempt?.attemptValue >= 2
                          ? currentAttempt?.attemptValue === 2
                            ? currentAttempt?.isCorrect
                              ? "bg-lightGreen3"
                              : "bg-lightRed2"
                            : "bg-lightRed2"
                          : "bg-lightGray4"
                      }`}
                    ></div>
                    <div
                      className={`w-[10px] h-[10px] ${
                        currentAttempt?.attemptValue >= 3
                          ? currentAttempt?.attemptValue === 3
                            ? currentAttempt?.isCorrect
                              ? "bg-lightGreen3"
                              : "bg-lightRed2"
                            : "bg-lightRed2"
                          : "bg-lightGray4"
                      }`}
                    ></div>
                    <div
                      className={`w-[10px] h-[10px] ${
                        currentAttempt?.attemptValue >= 4
                          ? currentAttempt?.attemptValue === 4
                            ? currentAttempt?.isCorrect
                              ? "bg-lightGreen3"
                              : "bg-lightRed2"
                            : "bg-lightRed2"
                          : "bg-lightGray4"
                      }`}
                    ></div>
                  </div>
                </div>
                {(currentAttempt?.isCorrect ||
                  currentAttempt?.attemptValue >= 4) && (
                  <div>
                    <div className="flex justify-center">
                      <div className="text-start w-[80%] text-[17px] mt-[10px] font-poppins  font-semibold">
                        Your Guesses:
                      </div>
                    </div>
                    <div className="flex justify-center flex-col items-center gap-2 mt-2 px-5">
                      {allAnswers?.map((el, i, arr) => {
                        return (
                          <div
                            className="w-[80%] flex justify-between items-center font-poppins mx-3"
                            key={i}
                          >
                            <div>{el}</div>
                            {currentAttempt?.isCorrect &&
                            arr.length - 1 === i ? (
                              <div>
                                <SlCheck className="text-green-600" />
                              </div>
                            ) : (
                              <SlClose className="text-red-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <button
                  onClick={() =>
                    currentAttempt?.isCorrect
                      ? handleCopyText(
                          `I got today’s Movie Guesser in ${
                            currentAttempt?.attemptValue
                          } ${
                            currentAttempt?.attemptValue === 1
                              ? "attempt"
                              : "attempts"
                          }. Check it out at`
                        )
                      : handleCopyText(
                          `Today's Movie Guesser question stumped me! Check it out at`
                        )
                  }
                  className={`bg-purple text-white w-[80px] p-2 rounded-[3px] mt-[15px] font-poppins  `}
                >
                  Share
                </button>
                <div className="text-[20px] my-[20px] font-poppins  font-semibold">
                  How Others Did
                </div>
                <div className="w-full flex justify-center items-center">
                  <div className="w-[75%] flex justify-center items-center">
                    <div className="vertical-progress-bars">
                      {questionStats.map((el, i, arr) => {
                        return (
                          <div key={i} className="progress-container">
                            <div className="label">
                              {i !== arr?.length - 1 ? `${i + 1}` : "X"}
                            </div>
                            <Progress
                              percent={parseFloat(el)}
                              strokeLinecap="butt"
                              size={[300, 20]}
                              // strokeWidth={14}
                              strokeColor={
                                i === arr?.length - 1 ? "#f2dbde" : "#d7eeeb"
                              }
                              showInfo={false}
                              className="progress-bar"
                            />
                            <div className="label_1">{el}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-[50px] flex justify-center">
                  <CustomSelect
                    options={option}
                    value={values.option || null}
                    className="w-[50%] rounded-l-[3px] border-l-2 border-t-2 border-b-2 border-gray3 font-poppins"
                    handleChange={(e) => {
                      setFieldValue("option", e);
                    }}
                  />
                  <button
                    disabled={currentAttempt?.attemptValue > 3}
                    onClick={handleSubmit}
                    className={`bg-purple text-white w-[30%] rounded-r-[3px] font-poppins rest ${
                      currentAttempt?.attemptValue > 4
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {loadingUnAth || loadingAuth || loadingOldAttempts
                      ? "Please wait..."
                      : "Submit"}
                  </button>
                </div>
                <div className="flex justify-center flex-col items-center gap-2 mt-2 px-5">
                  {allAnswers?.map((el, i) => {
                    return (
                      <div
                        className="w-[80%] flex justify-between items-center font-poppins mx-3"
                        key={i}
                      >
                        <div>{el}</div>
                        <div>
                          <SlClose className="text-red-600" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center text-[20px] font-poppins mt-[40px] font-semibold">
                  {4 - (currentAttempt?.attemptValue || 0)} Guesses Remaining
                </div>
              </>
            )}

            <div className="mb-16"></div>
          </div>
        ) : (
          <div className=" text-[25px] my-[50px] font-poppins  font-semibold w-full flex justify-center items-center max-h-screen">
            Couldn't find any question
          </div>
        )
      ) : (
        <div className=" text-[25px] my-[50px] font-poppins  font-semibold w-full flex justify-center items-center max-h-screen">
          Please wait...
        </div>
      )}
    </>
  );
};

export default TabContent;
