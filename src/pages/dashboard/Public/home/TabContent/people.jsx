/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { FaFire } from "react-icons/fa";
import CustomSelect from "../../../../../components/Select";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { setSelectOptions } from "../../../../../formik/validationSchema";
import { Notification } from "../../../../../components/ToastNotification";
import copy from "clipboard-copy";
import { SlCheck, SlClose } from "react-icons/sl";
import { IoLockClosed, IoLockOpen } from "react-icons/io5";
import {
  useGetAllPeopleQuery,
  useGetQuestionStateQuery,
  useGetUserStreakQuery,
  useMakeAttemptForUnregisteredUserMutation,
  useMakeAttemptMutation,
  useMakeOldQuestionAttemptMutation
} from "../../../../../services/auth";
import { Progress } from "antd";
import moment from "moment";
import { useAuth0 } from "@auth0/auth0-react";
import ConfettiExplosion from "react-confetti-explosion";
import Lottie from "react-lottie";
import fire from "../../../../../../public/assets/Fire.json";
import lose from "../../../../../../public/assets/lose.json";
import { Helmet } from "react-helmet";
const TabContent = ({ question, boolUserSelectedDate, isLoading }) => {
  const metaTitle = "People Quiz - Guess the Person | Daily Challenge";
  const metaDescription =
    "Join the People Quiz and guess the famous personality based on clues! Test your knowledge with our daily challenge and see how you rank on the leaderboard.";
  const [isExploding, setIsExploding] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
  const [initialValues] = useState({ option: "" });
  const [wikiLink, setWikiLink] = useState("");
  const [makeAttemptForUnregisteredUser, { isLoading: loadingUnAth }] =
    useMakeAttemptForUnregisteredUserMutation();
  const [makeAttempt, { isLoading: loadingAuth }] = useMakeAttemptMutation();
  const [makeOldAttempt, { isLoading: loadingOldAttempts }] =
    useMakeOldQuestionAttemptMutation();
  const [userStreak, setUserStreak] = useState(-1);

  const { data, error, status, refetch } = useGetUserStreakQuery();

  console.log(userStreak);
  if (status === "fulfilled" && userStreak === -1) {
    setUserStreak(data?.peopleStreak || 0);
  }

  const getLatestStreakFromDB = async () => {
    const { data } = await refetch();
    setUserStreak(data?.peopleStreak);
  };

  const [currentAttempt, setCurrentAttempt] = useState({
    quesID: question?.id,
    attemptValue: 0,
    isCorrect: false
  });
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [questionClues, setQuestionClues] = useState([]);
  const [option, setOption] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [clueMainAfter, setClueMainAfter] = useState("");
  const [streak, setStreak] = useState(
    localStorage.getItem("peopleStreak") || 0
  );
  const [questionStats, setQuestionStats] = useState([0, 0, 0, 0]);
  const [lostStreak, setLostStreak] = useState(false);
  const { data: stats, refetch: refetchStats } = useGetQuestionStateQuery({
    quesId: question?.id
  });

  const { data: allPeople } = useGetAllPeopleQuery();

  // useEffect(() => {
  //   console.log("stats ", stats)
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

  const [allAnswers, setAllAnswers] = useState(
    (Array.isArray(
      JSON.parse(localStorage.getItem(`answers-${question?.id}`))
    ) &&
      JSON.parse(localStorage.getItem(`answers-${question?.id}`))) ||
      []
  );

  useEffect(() => {
    const uniqueArray = Array.from(
      new Set(allPeople?.map((obj) => JSON.stringify(obj)))
    ).map((str) => JSON.parse(str));
    const processedOptions =
      (Array.isArray(uniqueArray) &&
        uniqueArray.length > 0 &&
        uniqueArray.map((option) => {
          return {
            ...option,
            disabled: allAnswers?.includes(option.value),
            key: Math.random()
          };
        })) ||
      [];

    setOption(processedOptions);
  }, [allPeople, allAnswers]);

  const attempts = JSON.parse(localStorage.getItem("peopleAttempts")) || [];
  const oldQuestionAttempts =
    JSON.parse(localStorage.getItem("oldPeopleQuestionAttempts")) || [];

    useEffect(() => {
      console.log("questionClues ", questionClues);
    },[questionClues])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: setSelectOptions,
    onSubmit: async (values, { resetForm }) => {
      const token = !!localStorage.getItem("token");
      if (boolUserSelectedDate) {
        try {
            const result = await makeOldAttempt({
              attemptDataId: question?.attemptsInfo?.id,
              userID: localStorage.getItem("userID") ?? "auth",
              chooseValue: values.option,
              questionType: "people"
            });

            if (result?.data) {
              setAllAnswers([...(allAnswers ?? []), values.option]);
              console.log("result?.data; ", result?.data);
              if (result?.data?.isCorrect === false) {
                  setCurrentAttempt({
                    quesID: question?.id,
                    attemptValue: result?.data?.attemptNumber,
                    isCorrect: result?.data?.isCorrect
                  });
                if (result?.data?.clueOne?.nationality) {
                  setQuestionClues([
                    result?.data?.clueOne?.nationality
                  ]);
                }
                if (result?.data?.clueTwo?.lifespan) {
                  setQuestionClues([
                    ...questionClues,
                    result?.data?.clueTwo?.lifespan
                  ]);
                } else if (result?.data?.clueThree?.initials) {
                  setQuestionClues([
                    ...questionClues,
                    result?.data?.clueThree?.initials
                  ]);
                }
                if (result?.data?.answer) {
                  setCorrectAnswer(result?.data?.answer);
                  setClueMainAfter(result?.data?.clueMainAfter);
                }
              } else {
                const updatedArray = [
                  result?.data?.clueOne?.nationality,
                  result?.data?.clueTwo?.lifespan,
                  result?.data?.clueThree?.initials
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
                // setStreak(calculateStreak("increament"));
                setShowConfetti(true);
              }
              refetchStats();
              resetForm();
            }
          

          localStorage.setItem(
            "oldPeopleQuestionAttempts",
            JSON.stringify(oldQuestionAttempts)
          );
        } catch (e) {
          console.log("error", e);
        }
      } else {
        if (!token) {
          try {
              const newAttemptObj = {
                quesID: question?.id,
                attemptValue: 0,
                isCorrect: false
              };
              const result = await makeAttemptForUnregisteredUser({
                attemptDataId: question?.attemptsInfo?.id,
                userID: localStorage.getItem("userID"),
                chooseValue: values.option,
                questionType: "people",
                attemptData: newAttemptObj
              });

              newAttemptObj.attemptValue = 1;
              console.log("attempt unauth ", result);
              if (result?.data) {
                setAllAnswers([...(allAnswers ?? []), values.option]);
                console.log("result?.data; ", result?.data);
                if (result?.data?.isCorrect === false) {
                    setCurrentAttempt({
                      quesID: question?.id,
                      attemptValue: result?.data?.attemptNumber,
                      isCorrect: result?.data?.isCorrect
                    });
                  if (result?.data?.clueOne?.nationality) {
                    setQuestionClues([result?.data?.clueOne?.nationality]);
                  }
                  if (result?.data?.clueTwo?.lifespan) {
                    setQuestionClues([
                      ...questionClues,
                      result?.data?.clueTwo?.lifespan
                    ]);
                  } else if (result?.data?.clueThree?.initials) {
                    setQuestionClues([
                      ...questionClues,
                      result?.data?.clueThree?.initials
                    ]);
                  }
                  if (result?.data?.answer) {
                    localStorage.setItem(
                      "lastDatePlayed-people",
                      question?.date
                    );
                    setCorrectAnswer(result?.data?.answer);
                    setClueMainAfter(result?.data?.clueMainAfter);
                    setStreak(calculateStreak("reset"));
                  }
                } else {
                  localStorage.setItem("lastDatePlayed-people", question?.date);
                  const updatedArray = [
                    result?.data?.clueOne?.nationality,
                    result?.data?.clueTwo?.lifespan,
                    result?.data?.clueThree?.initials
                  ];
                  setQuestionClues(updatedArray);
                  setCorrectAnswer(result?.data?.answer);
                  setClueMainAfter(result?.data?.clueMainAfter);
                  setCurrentAttempt({
                    quesID: question?.id,
                    attemptValue: result?.data?.attemptNumber,
                    isCorrect: result?.data?.isCorrect
                  });
                  const filteredAnswers =
                    result?.data?.allResponses.filter(
                      (element) => element !== null
                    );
                  setAllAnswers(filteredAnswers);
                  setStreak(calculateStreak("increament"));
                  setIsExploding(true);
                }
                refetchStats();
                resetForm();
              }
            

            localStorage.setItem("peopleAttempts", JSON.stringify(attempts));
          } catch (e) {
            console.log("error", e);
          }
        } else {
          try {
            const result = await makeAttempt({
              attemptDataId: question?.attemptsInfo?.id,
              chooseValue: values.option,
              questionType: "people"
            });

            if (result?.data) {
              setAllAnswers([...(allAnswers ?? []), values.option]);
                if (result?.data?.isCorrect === false) {
                  setCurrentAttempt({
                    quesID: question?.id,
                    attemptValue: result?.data?.attemptNumber,
                    isCorrect: result?.data?.isCorrect
                  });
                  if (result?.data?.clueOne?.nationality) {
                    setQuestionClues([
                      result?.data?.clueOne?.nationality
                    ]);
                  }
                  if (result?.data?.clueTwo?.lifespan) {
                    setQuestionClues([
                      ...questionClues,
                      result?.data?.clueTwo?.lifespan
                    ]);
                  } else if (result?.data?.clueThree?.initials) {
                    setQuestionClues([
                      ...questionClues,
                      result?.data?.clueThree?.initials
                    ]);
                  }
                  if (result?.data?.answer) {
                    setCorrectAnswer(result?.data?.answer);
                    setClueMainAfter(result?.data?.clueMainAfter);
                  }
                } else {
                  const updatedArray = [
                    result?.data?.clueOne?.nationality,
                    result?.data?.clueTwo?.lifespan,
                    result?.data?.clueThree?.initials
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
                refetchStats();
                resetForm();
              
            } else {
              Notification("Attempts limit reached", "error");
              refetchStats();
              resetForm();
            }
          } catch (e) {
            console.log("error", e);
            Notification(e?.message, "error");
          }
        }
      }
    }
  });

  // useEffect(() => {
  //   const allClues =
  //     JSON.parse(localStorage.getItem(`question-${question?.id}-clues`)) || [];

  //   const allAnswers =
  //     JSON.parse(localStorage.getItem(`answers-${question?.id}`)) || [];

  //   const clueMainAfterLocal =
  //     localStorage.getItem(`clueMainAfter-${question?.id}`) || "";

  //   const correctAnswer = localStorage.getItem(
  //     `correct_Answer-${question?.id}`
  //   );

  //   setCorrectAnswer(correctAnswer);
  //   setQuestionClues(allClues);
  //   setAllAnswers(allAnswers);
  //   setClueMainAfter(clueMainAfterLocal);
  // }, [question?.id]);

  useEffect(() => {
    if (question?.wikiLink) {
      setWikiLink(question?.wikiLink);
    }
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
  //     JSON.parse(localStorage.getItem("peopleAttempts")) || [];
  //   const attempt = totalAttempts.filter((attempt) => {
  //     return attempt.quesID === question?.id;
  //   })[0];

  //   if (!token) {
  //     if (totalAttempts.length > 0 && attempt) {
  //       if (attempt) {
  //         setCurrentAttempt({
  //           ...currentAttempt,
  //           attemptValue: attempt?.attemptValue,
  //           isCorrect: attempt?.isCorrect
  //         });
  //       }
  //     } else {
  //       setCurrentAttempt({
  //         quesID: question?.id,
  //         attemptValue: 0,
  //         isCorrect: false
  //       });
  //     }
  //   }
  //   // setStreak(calculateStreak());
  //   refetchStats();
  // }, [handleSubmit, question?.id]);

  const handleCopyText = (text) => {
    const url = "https://guessable.in/people";
    copy(`${text} ${url}`).then(() => {
      Notification("You have Coppied text successfully!");
    });
  };

  useEffect(() => {
    console.log("USER Streak FOUND ", userStreak);
    const currentDateFoundInQuestion = question?.date;

    const lastDatePlayedRetrieved = localStorage.getItem("lastDatePlayed-people");

    if (
      lastDatePlayedRetrieved &&
      moment(lastDatePlayedRetrieved)
        .add(1, "days")
        .isBefore(currentDateFoundInQuestion)
    ) {
      setStreak(0);
      localStorage.setItem("peopleStreak", 0);
    }
  }, [user]);

  let token = localStorage.getItem("token");
  function calculateStreak(gameState) {
    if (token) {
      return userStreak?.peopleStreak === null ? 0 : userStreak?.peopleStreak;
    } else {
      const currentDateFoundInQuestion = question?.date;

      const lastDatePlayedRetrieved =
        localStorage.getItem("lastDatePlayed-people") || currentDateFoundInQuestion;
      console.log(lastDatePlayedRetrieved, currentDateFoundInQuestion);

      let peopleStreak = localStorage.getItem("peopleStreak") || 0;
      console.log("peopleStreak ", peopleStreak);
      console.log("gameState ", gameState);

      if (
        moment(currentDateFoundInQuestion).isSame(
          moment(lastDatePlayedRetrieved)
        )
      ) {
        if (gameState === "reset") {
          peopleStreak = 0;
          setLostStreak(true);
        } else if (gameState === "increament") {
          peopleStreak++;
          setIsExploding(true);
        }
      }
      console.log(lastDatePlayedRetrieved, currentDateFoundInQuestion, peopleStreak);
      localStorage.setItem("peopleStreak", peopleStreak);
      return peopleStreak;
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
    const renderTextWithLineBreaks = (text) => {
      // Check if the text includes an HTML-like <br> tag
      if (text.includes("<br>")) {
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
      } else {
        // Split the text by newlines and render using <br /> tags
        return text.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ));
      }
    };
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="Country Quiz, Guess the Country, Daily Challenge, Quiz Game, Geography Quiz" />
        <meta name="author" content="Guessable" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://guessable.in/people" />
        {/* <meta property="og:image" content="https://guessable.in/assets/country-quiz-thumbnail.jpg" /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {/* <meta name="twitter:image" content="https://guessable.in/assets/country-quiz-thumbnail.jpg" /> */}
      </Helmet>
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

                {/* <div
                  style={{
                    pointerEvents: "none",
                    margin: "0px 5px 5px 0px"
                  }}
                >
                  {
                  lostStreak ||
                    !userStreak && 
                      
                      <Lottie
                        options={loseOptions}
                        height={25}
                        width={25}
                        isStopped={false}
                        // isPaused={false}
                      />
                    }
                </div> */}

                <div className="text-[20px] font-[700] font-poppins">
                  <span>
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
              Guess the person based on this clue
            </div>
            {/* <div className="text-justify px-[5%] font-poppins mt-3">
              {currentAttempt?.isCorrect || currentAttempt?.attemptValue >= 4
                ? clueMainAfter
                : question?.clueMainBefore}
            </div> */}
            <div className="text-justify px-[5%] font-poppins mt-3">
              {currentAttempt?.isCorrect || currentAttempt?.attemptValue >= 4
                ? renderTextWithLineBreaks(clueMainAfter)
                : renderTextWithLineBreaks(question?.clueMainBefore)}
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
                {/* {
                      lat: result?.data?.clueOne?.nationality,
                      long: result?.data?.clueOne?.nationality,
                    }, */}
                {currentAttempt?.attemptValue > 0 ||
                currentAttempt?.isCorrect ? (
                  <div>
                    <div>
                      {questionClues?.[0]}
                      {/* {questionClues?.[0]?.lat?.split(" ")[0]}°{" "}
                    {questionClues?.[0]?.lat?.split(" ")[1]},{" "}
                    {questionClues?.[0]?.long?.split(" ")[0]}°{" "}
                    {questionClues?.[0]?.long?.split(" ")[1]} */}
                    </div>
                    <div>Nationality</div>
                  </div>
                ) : (
                  <div>Nationality</div>
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
                    <div>{questionClues?.[1]}</div>
                    <div>Lifespan</div>
                  </div>
                ) : (
                  //   <img
                  //     // src={`${import.meta.env.VITE_API_URL}/${
                  //     //   questionClues?.[1]
                  //     // }`}
                  //     src={`/${questionClues?.[1]}`}
                  //     className="w-[30px] h-[20px]"
                  //     alt=""
                  //   />
                  <div>Lifespan</div>
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
                    <div>Initials</div>
                  </div>
                ) : (
                  <div>Initials</div>
                )}
              </button>
            </div>
            {currentAttempt?.isCorrect || currentAttempt?.attemptValue >= 4 ? (
              <div className="mt-[50px] text-center">
                <div className="text-[15px] font-poppins  font-light">
                  {
                    // isExploding &&
                  }
                  {currentAttempt?.isCorrect
                    ? "You Got It!"
                    : "The Answer Was:"}
                </div>
                <div className="text-[20px] mt-[10px] font-poppins  font-semibold">
                  {correctAnswer}
                </div>
                <p>
                <a 
                  href={wikiLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'blue', textDecoration: 'underline' }}
                >
                  (Learn More)
                </a>
              </p>
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
                          `I got today’s People Guesser in ${
                            currentAttempt?.attemptValue
                          } ${
                            currentAttempt?.attemptValue === 1
                              ? "attempt"
                              : "attempts"
                          }. Check it out at`
                        )
                      : handleCopyText(
                          "Today's Country Guesser question stumped me! Check it out at"
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
            <div className="mb-5"></div>
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
