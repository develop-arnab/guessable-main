import { Progress } from "antd";
import {
  useGetUserStatsQuery,
  useGetUserStreakQuery
} from "../../../services/auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const States = () => {
  const location = useLocation();
  const [questionType, setQuestionType] = useState(
    location.pathname === "/" || location.pathname === "/countries"
      ? "country"
      : location.pathname === "/movies"
      ? "movie"
      : "people"
  );

  const { data: userStats } = useGetUserStatsQuery({ questionType });
  const { data: userStreakData, status, refetch } = useGetUserStreakQuery();
  const [userStreak, setUserStreak] = useState({
    countryStreak: 0,
    movieStreak: 0,
    peopleStreak: 0
  });

  const [stats, setStats] = useState({
    played: 0,
    winPercentage: "0.00",
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0],
    averageScore: "0.00"
  });

  useEffect(() => {
    setQuestionType(
      location.pathname === "/" || location.pathname === "/countries"
        ? "country"
        : location.pathname === "/movies"
        ? "movie"
        : "people"
    );
  }, [location]);

  useEffect(() => {
    if (userStats && userStreakData) {
      const currentStreak = userStreakData[`${questionType}Streak`] || 0;
      const maxStreak = userStreakData.maxStreak[`${questionType}Streak`] || 0;
      setStats({
        played: userStats.played || 0,
        winPercentage: isNaN(parseFloat(userStats.winPercentage))
          ? "0.00"
          : userStats.winPercentage,
        currentStreak,
        maxStreak,
        guessDistribution: [
          isNaN(parseFloat(userStats.guessDistribution["1"]))
            ? 0
            : parseFloat(userStats.guessDistribution["1"]),
          isNaN(parseFloat(userStats.guessDistribution["2"]))
            ? 0
            : parseFloat(userStats.guessDistribution["2"]),
          isNaN(parseFloat(userStats.guessDistribution["3"]))
            ? 0
            : parseFloat(userStats.guessDistribution["3"]),
          isNaN(parseFloat(userStats.guessDistribution["4"]))
            ? 0
            : parseFloat(userStats.guessDistribution["4"]),
          isNaN(parseFloat(userStats.guessDistribution["X"]))
            ? 0
            : parseFloat(userStats.guessDistribution["X"])
        ],
        averageScore: isNaN(parseFloat(userStats.averageScore))
          ? "0.00"
          : userStats.averageScore
      });
    }
  }, [userStats, userStreakData, questionType]);

  useEffect(() => {
    if (status === "fulfilled") {
      const currentStreak = userStreakData?.[`${questionType}Streak`] || 0;
      setUserStreak((prevStreak) => ({
        ...prevStreak,
        [`${questionType}Streak`]: currentStreak
      }));
      setStats((prevStats) => ({
        ...prevStats,
        currentStreak,
        maxStreak: userStreakData?.maxStreak?.[`${questionType}Streak`] || 0
      }));
    }
  }, [status, userStreakData, questionType]);

  const getLatestStreakFromDB = async () => {
    const { data } = await refetch();
    const currentStreak = data?.[`${questionType}Streak`] || 0;
    setUserStreak((prevStreak) => ({
      ...prevStreak,
      [`${questionType}Streak`]: currentStreak
    }));
    setStats((prevStats) => ({
      ...prevStats,
      currentStreak,
      maxStreak: data?.maxStreak?.[`${questionType}Streak`] || 0
    }));
  };

  return (
    <>
      <div className="text-center font-[600] text-[19px] mt-4 font-poppins">
        Your Stats -{" "}
        {localStorage.getItem("current_tab")
          ? localStorage.getItem("current_tab")?.charAt(0)?.toUpperCase() +
            localStorage.getItem("current_tab")?.slice(1)
          : "Countries"}
      </div>
      <div className="flex justify-around flex-wrap items-start font-[700] mt-4 font-poppins">
        <div className="flex flex-col justify-center items-center">
          <div className="text-[20px]">{stats.played}</div>
          <div className="-mb-2 text-[15px]">Played</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-[20px]">{stats.winPercentage}%</div>
          <div className="-mb-2 text-[15px]">Win</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-[20px]">{stats.currentStreak}</div>
          <div>
            <div className="-mb-2 text-[15px]">Current</div>
            <div className="">Streaks</div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="text-[20px]">{stats.maxStreak}</div>
          <div className="text-center ">
            <div className="-mb-2 text-[15px]">Max</div>
            <div className="">Streaks</div>
          </div>
        </div>
      </div>
      <div className="mt-[10px]">
        <div className="my-[10px] font-poppins text-[15px] font-[600]">
          Guess Distribution
        </div>
        {stats.guessDistribution.map((el, i) => (
          <div key={i} className="flex items-start">
            <div className="w-[30px]">{i + 1}.</div>
            <Progress
              percent={el}
              size={["100%", 14]}
              strokeColor={el >= 20 ? "#51ab9f" : "#c3505e"}
              showInfo={false}
            />
            <div className="w-[30px]">({el})</div>
          </div>
        ))}
        <div className="my-[10px] text-center font-poppins text-[15px] font-[600]">
          Your Score: {stats.averageScore} (avg.)
        </div>
      </div>
    </>
  );
};

export default States;
