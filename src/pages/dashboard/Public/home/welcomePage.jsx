/* eslint-disable react/prop-types */

import Header from "../../../../layout/header";
import welcomeImg from "../../../../assets/welcome.png";
import Button from "../../../../components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  useSignIn0AuthMutation,
  useSignupWithGameDataMutation,
} from "../../../../services/auth";
import Loader from "../../../../components/Loader";
import { Notification } from "../../../../components/ToastNotification";
import { getUTCTime } from "../../../../utils/constant";

const Home = () => {
  const navigate = useNavigate();
  const [SignInAuth0, { isLoading }] = useSignIn0AuthMutation();
  const [signupWithGameData, { isLoading: isLoadingSignupWithGameData }] =
    useSignupWithGameDataMutation();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const handleSubmit = () => {
    navigate("/countries");
  };

  useEffect(() => {
    const authenticateUser = async () => {
      if (isAuthenticated) {
        const userData = {
          email: user?.email,
          name: user?.name,
          oAuthId: user?.sub,
          timezone: getUTCTime(),
          oAuthProvider: "google",
          additionalData: {
            email_verified: user?.email_verified,
            family_name: user?.family_name,
            given_name: user?.given_name,
            locale: user?.locale,
            nickname: user?.nickname,
            picture: user?.picture,
            sub: user?.sub,
            updated_at: user?.updated_at,
          },
        };
        SignInAuth0(userData)
          .unwrap()
          .then((payload) => {
            Notification("Login successful!", "success");
            localStorage.setItem("token", payload?.token);
            localStorage?.setItem("user", JSON.stringify(payload?.user));
          })
          .catch((error) => {
            console.error("Login failed:", error);
          });
        const movieAttempts = JSON.parse(localStorage.getItem("movieAttempts"));
        const countryAttempts = JSON.parse(
          localStorage.getItem("countryAttempts"),
        );
        const movieStreak = JSON.parse(localStorage.getItem("movieStreak"));
        const countryStreak = JSON.parse(localStorage.getItem("countryStreak"));

        const unAuthData = {
          attemptDataArr: [...movieAttempts, ...countryAttempts],
          userInfo: {
            email: user?.email,
            name: user?.name,
            oAuthId: user?.sub,
            oAuthProvider: "google",
            additionalData: {
              email_verified: user?.email_verified,
              family_name: user?.family_name,
              given_name: user?.given_name,
              locale: user?.locale,
              nickname: user?.nickname,
              picture: user?.picture,
              sub: user?.sub,
              updated_at: user?.updated_at,
            },
          },
          streaks: {
            countryStreak: countryStreak || 0,
            movieStreak: movieStreak || 0,
          },
          signUpType: "oauth",
          timezone: getUTCTime(),
        };
        signupWithGameData(unAuthData)
          .unwrap()
          .then((payload) => {
            Notification("Your data has been saved successfully!", "success");
            localStorage.clear();
            localStorage.setItem("token", payload?.token);
            localStorage.setItem("user", JSON.stringify(payload?.user));
          })
          .catch((error) => {
            console.error("Login failed:", error);
          });
      }
    };

    authenticateUser();
  }, [isAuthenticated, user, SignInAuth0, getAccessTokenSilently]);
  return (
    <>
      {!isLoading || isLoadingSignupWithGameData ? (
        <div className="bg-white3 min-h-screen flex flex-col">
          <div className="flex flex-col flex-grow bg-white sm:mx-auto sm:w-full sm:max-w-xl ">
            <div className="flex flex-col">
              <Header isSignIn={false} name="GUESSABLE" />

              <div className="w-full min-h-[calc(100vh-150px)] flex flex-col justify-center items-center">
                <div>
                  <div className="text-center my-5 font-poppins text-1xl leading-2 tracking-tight text-[24px] font-[600]">
                    Welcome to Guessable.In
                  </div>
                  <div>
                    <img
                      src={welcomeImg}
                      alt="Animated Image"
                      className="animate-up-and-down"
                    />
                  </div>
                  <div className="w-full">
                    <Button
                      authButton={true}
                      text="Continue"
                      type="submit"
                      onClick={handleSubmit}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Home;
