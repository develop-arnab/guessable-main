/* eslint-disable react/prop-types */
import { useState } from "react";
import { useFormik } from "formik";
import { signUpSchema } from "../../formik/schema";
import { signUpValidationSchema } from "../../formik/validationSchema";
import CustomButton from "../../components/Button";
import { useAuth0 } from "@auth0/auth0-react";

import Input from "../../components/Input/index";
import PasswordInput from "../../components/Input/password";
import {
  useSignUpMutation,
  useSignupWithGameDataMutation,
} from "../../services/auth";
import { Notification } from "../../components/ToastNotification";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUTCTime } from "../../utils/constant";

const LoginAuth0Button = ({ type }) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button onClick={() => loginWithRedirect()}>
      {type === "google" ? (
        <FcGoogle className="text-[30px]" />
      ) : (
        <FaFacebook className="text-[30px] text-blue-500" />
      )}
    </button>
  );
};
const Signup = ({ setModalType }) => {
  const [initialValues] = useState(signUpSchema);
  const [openEye1, setOpenEye1] = useState(true);
  const [openEye2, setOpenEye2] = useState(true);
  const [signUp, { isLoading }] = useSignUpMutation();
  const [signupWithGameData, { isLoading: isLoadingSignupWithGameData }] =
    useSignupWithGameDataMutation();

  const navigate = useNavigate();

  const handleEyeOpen1 = () => {
    setOpenEye1(!openEye1);
  };

  const handleEyeOpen2 = () => {
    setOpenEye2(!openEye2);
  };

  const movieAttempts = JSON.parse(localStorage.getItem("movieAttempts")) || [];
  const countryAttempts =
    JSON.parse(localStorage.getItem("countryAttempts")) || [];
  const movieStreak = JSON.parse(localStorage.getItem("movieStreak")) || 0;
  const countryStreak = JSON.parse(localStorage.getItem("countryStreak")) || 0;

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: signUpValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await signUp({
          name: values?.full_name,
          email: values?.email_address,
          password: values?.password,
          confirmPassword: values?.confirm_password,
          timezone: getUTCTime(),
        });
        const unAuthData = {
          attemptDataArr: [...movieAttempts, ...countryAttempts],
          userInfo: {
            name: values?.full_name,
            email: values?.email_address,
            password: values?.password,
            confirmPassword: values?.confirm_password,
          },
          streaks: {
            countryStreak: countryStreak || 0,
            movieStreak: movieStreak || 0,
          },
          signUpType: "email",
        };
        if (result?.data?.message === "Sign up success") {
          Notification(
            "Your account has been created successfully!",
            "success",
          );
          signupWithGameData(unAuthData)
            .unwrap()
            .then((payload) => {
              Notification("Your data has been saved successfully!", "success");
              localStorage.clear();
              localStorage.setItem("token", payload?.token);
              localStorage.setItem("user", JSON.stringify(payload?.user));
              navigate("/welcome");
            })
            .catch((error) => {
              console.error("Login failed:", error);
            });
          resetForm();
          setModalType("login");
        } else {
          Notification(result?.error?.data?.message, "error");
        }
      } catch (err) {
        console.error("Failed to login:", err);
        Notification(err, "error");
      }
    },
  });
  const { values, handleChange, handleBlur, errors, handleSubmit } = formik;

  return (
    <>
      <div className=" bg-white text-black p-0  z-10 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-5 font-poppins text-1xl leading-2 tracking-tight text-[24px] font-[600]">
            Create Your Guessable Account
          </h2>
          <h2 className="mt-2 text-lightGray leading-2 tracking-tight  text-[12px] font-[400] font-poppins">
            <span className="font-bold">Benefits of Signing up:</span> Lorem
            ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum quod
            expedita, vitae veniam molestiae ipsa cumque
          </h2>
          <div className="w-full flex justify-center items-center gap-3">
            <LoginAuth0Button type="google" />
            <LoginAuth0Button type="facebook" />
          </div>
          <h2 className="text-center my-1 text-[20px] font-bold text-gray3">
            OR
          </h2>
          <h2 className="mt-3 text-lightGray leading-2 tracking-tight  text-[12px] font-[400] font-poppins">
            Kindly fill in your details below to login
          </h2>
        </div>
        <div className="mt-0 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="" action="#" method="POST">
            <div className="mt-3">
              <Input
                error={errors?.full_name}
                value={values?.full_name}
                handleBlur={handleBlur}
                handleChange={handleChange}
                label="Name"
                name="full_name"
              />
            </div>
            <div className="mt-4">
              <Input
                error={errors?.email_address}
                value={values?.email_address}
                handleBlur={handleBlur}
                handleChange={handleChange}
                label="Email Address"
                name="email_address"
              />
            </div>

            <div className="mt-4">
              <PasswordInput
                error={errors?.password}
                value={values?.password}
                handleBlur={handleBlur}
                handleChange={handleChange}
                label="Password"
                name="password"
                handleEyeOpen={handleEyeOpen1}
                openEye={openEye1}
              />
            </div>
            <div className="mt-4">
              <PasswordInput
                error={errors?.confirm_password}
                value={values?.confirm_password}
                handleBlur={handleBlur}
                handleChange={handleChange}
                label="Confirm Password"
                name="confirm_password"
                handleEyeOpen={handleEyeOpen2}
                openEye={openEye2}
              />
            </div>

            <div className="w-full mt-6">
              <CustomButton
                authButton={true}
                isLoading={isLoading || isLoadingSignupWithGameData}
                text="Register with Us"
                type="submit"
                onClick={handleSubmit}
                className="mt-2"
              />
            </div>
            <div className="w-full text-center text-[13px] mt-4 font-poppins">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setModalType("login")}
                className="text-purple"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
