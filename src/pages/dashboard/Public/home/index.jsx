/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import Layout from "./layout";
import { Tabs } from "antd";
import { FaGlobe } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaPhotoVideo } from "react-icons/fa";
import MovieContent from "./TabContent/movie";
import CountryContent from "./TabContent/country";
import PeopleContent from "./TabContent/people";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  useGetQuestionsByAuthUserQuery,
  useGetQuestionsByUnAuthUserQuery,
  useGetUserSelectedQuestionQuery,
} from "../../../../services/auth";
import { useEffect, useState } from "react";
import Loader from "../../../../components/Loader";
import { Notification } from "../../../../components/ToastNotification";
import ShortUniqueId from "short-unique-id";

const TabHeader = ({ name, icon }) => {
  return (
    <div className="flex flex-col justify-center items-center font-poppins text-[16px] font-[600]">
      <div className="text-[25px]">{icon}</div>
      <div>{name}</div>
    </div>
  );
};

const Home = () => {
  const { TabPane } = Tabs;
  const { isAuthenticated } = useAuth0();
  const isAuthUser = !!localStorage.getItem("token");
  const isLoggedIn = isAuthUser || isAuthenticated;
  const [userSelectedDate, setUserSelectedDate] = useState(null);
  const boolUserSelectedDate = !!userSelectedDate;
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [globalSelectedDate, setGlobalSelectedDate] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if(!isLoggedIn){
      console.log("I am not logged in")
      if (!localStorage.getItem("userID")) {
        const uid = new ShortUniqueId({ length: 10 });
        localStorage.setItem("userID", uid.rnd());
      }
    }
  }, [])
  

  const [questionType, setQuestionType] = useState(
    location.pathname === "/" || location.pathname === "/countries"
      ? "country"
      : location.pathname === "/movies"
      ? "movie"
      : "people"
  );
  useEffect(() => {
    setQuestionType(
      location.pathname === "/" || location.pathname === "/countries"
        ? "country"
        : location.pathname === "/movies"
        ? "movie"
        : "people"
    );
  }, [location]);


  const {
    data: questionForUnAuthUser,
    error: errorForUnAuthUser,
    isLoading: loadingForUnAuthUser,
    isFetching: fetchingForUnAuthUser,
  } = useGetQuestionsByUnAuthUserQuery(
    { questionType },
    {
      skip: isLoggedIn,
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    data: questionForAuthUser,
    error: errorForAuthUser,
    isLoading: loadingForAuthUser,
    isFetching: fetchingForAuthUser,
  } = useGetQuestionsByAuthUserQuery(
    { questionType },
    {
      skip: !isLoggedIn,
      refetchOnMountOrArgChange: true,
    },
  );

  const {
    data: userSelectedDateQuestion,
    error: ErrorUserSelectedDateQuestion,
    isLoading: loadingUserSelectedDateQuestion,
    isFetching: fetchingUserSelectedDate,
  } = useGetUserSelectedQuestionQuery(
    { questionType, date: userSelectedDate },
    {
      skip: !boolUserSelectedDate,
      refetchOnMountOrArgChange: true,
    },
  );

  const questionData = boolUserSelectedDate
    ? userSelectedDateQuestion
    : isLoggedIn
      ? questionForAuthUser
      : questionForUnAuthUser;

  const questionError = boolUserSelectedDate
    ? ErrorUserSelectedDateQuestion
    : isLoggedIn
      ? errorForAuthUser
      : errorForUnAuthUser;
  const questionLoading = boolUserSelectedDate
    ? loadingUserSelectedDateQuestion || fetchingUserSelectedDate
    : isLoggedIn
      ? loadingForAuthUser || fetchingForAuthUser
      : loadingForUnAuthUser || fetchingForUnAuthUser;

  useEffect(() => {
    if (ErrorUserSelectedDateQuestion) {
      setUserSelectedDate(null);
      setOpen(true);
      setErrorMessage(ErrorUserSelectedDateQuestion?.data?.message);
      Notification(ErrorUserSelectedDateQuestion?.data?.message, "error");
    } else if (userSelectedDateQuestion) {
      setErrorMessage("");
    }
  }, [ErrorUserSelectedDateQuestion, userSelectedDateQuestion]);

  const onChange = (key) => {
    navigate(`/${key}`);
    if (key === "countries") {
      setQuestionType("country");
      setUserSelectedDate(null);
    } else if (key === "movies") {
      setQuestionType("movie");
      setUserSelectedDate(null);
    } else if (key === "people") {
      setQuestionType("people");
      setUserSelectedDate(null);
    }
    localStorage.setItem("current_tab", key);
  };

  let activeKey = location.pathname.replace("/", "");
  if (!["countries", "movies", "people"].includes(activeKey)) {
    activeKey = "countries";
  }

  return (
    <>
      {loadingForUnAuthUser ? (
        <Loader />
      ) : (
        <Layout
          setUserSelectedDate={setUserSelectedDate}
          userSelectedDate={userSelectedDate}
          questionError={questionError}
          questionLoading={questionLoading}
          open={open}
          setOpen={setOpen}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setGlobalSelectedDate={setGlobalSelectedDate}
          globalSelectedDate={globalSelectedDate}
        >
          <Tabs
            className="bg-white"
            centered
            defaultActiveKey={activeKey}
            activeKey={activeKey}
            onChange={onChange}
          >
            <TabPane
              tab={<TabHeader name="Countries" icon={<FaGlobe />} />}
              key="countries"
            >
              <CountryContent
                boolUserSelectedDate={boolUserSelectedDate}
                question={questionData}
                isLoading={questionLoading}
                error={questionError}
                setGlobalSelectedDate={setGlobalSelectedDate}
                globalSelectedDate={globalSelectedDate}
              />
            </TabPane>
            <TabPane
              tab={<TabHeader name="Movies" icon={<FaPhotoVideo />} />}
              key="movies"
            >
              <MovieContent
                boolUserSelectedDate={boolUserSelectedDate}
                question={questionData}
                isLoading={questionLoading}
                error={questionError}
                setGlobalSelectedDate={setGlobalSelectedDate}
                globalSelectedDate={globalSelectedDate}
              />
            </TabPane>
            <TabPane
              tab={<TabHeader name="People" icon={<FaUser />} />}
              key="people"
            >
              <PeopleContent
                boolUserSelectedDate={boolUserSelectedDate}
                question={questionData}
                isLoading={questionLoading}
                error={questionError}
                setGlobalSelectedDate={setGlobalSelectedDate}
                globalSelectedDate={globalSelectedDate}
              />
            </TabPane>
          </Tabs>
        </Layout>
      )}
    </>
  );
};

export default Home;
