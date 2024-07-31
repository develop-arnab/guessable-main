/* eslint-disable react/prop-types */
import { useState } from "react";
import { signInSchema } from "../../formik/schema";
import { signInValidationSchema } from "../../formik/validationSchema";
import { useFormik } from "formik";
import { useLoginMutation } from "../../services/auth";
import { Notification } from "../../components/ToastNotification";
import Button from "../../components/Button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth0 } from "@auth0/auth0-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { getUTCTime } from "../../utils/constant";
import { useNavigate } from "react-router-dom";

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

const SignIn = ({ setModalType, setOpen }) => {
  const [openEye, setOpenEye] = useState(true);
  const [initialValues] = useState(signInSchema);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const handleEyeOpen = () => {
    setOpenEye(!openEye);
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: signInValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await login({
          email: values?.email_address,
          password: values?.password,
          timezone: getUTCTime(),
        });

        localStorage.setItem("user", JSON.stringify(result?.data?.user));
        localStorage.setItem("token", JSON.stringify(result?.data?.token));

        if (result?.data?.message === "Sign in success") {
          Notification("Successfully logged in!", "success");
          navigate("/welcome");
          setOpen(false);
          resetForm();
        } else {
          Notification(result?.error?.data?.message, "error");
        }
      } catch (err) {
        console.log("Failed to login:", err);
        Notification(err, "error");
      }
    },
  });
  const { values, handleChange, handleBlur, errors, handleSubmit } = formik;
  return (
    <>
      <div className="bg-white text-black p-0 z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-5 font-poppins text-1xl leading-2 tracking-tight text-[24px] font-[600]">
            WELCOME TO GUESSABLE 👋
          </h2>
          <h2 className="mt-2 text-lightGray leading-2 tracking-tight  text-[12px] font-[400] font-poppins">
            Signup to track your Guessable stats across devices.<br></br>
            No spam, I promise!
          </h2>
          <div className="w-full flex justify-center items-center gap-3">
            <LoginAuth0Button type="google" />
            <LoginAuth0Button type="facebook" />
          </div>
          {/* <h2 className="text-center my-1 text-[20px] font-bold text-gray3">
            OR
          </h2>
          <h2 className="mt-3 text-lightGray leading-2 tracking-tight  text-[12px] font-[400] font-poppins">
            Kindly fill in your details below to login
          </h2> */}
        </div>
        {/* <div className="mt-0 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="" action="#" method="POST">
            <div>
              <div className="mt-3">
                <div className="text-[12px] pl-0.5 pb-1 font-poppins">
                  Email Address
                </div>
                <div
                  className={`flex align-bottom w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset ring-lightGray ${
                    errors.email_address ? "ring-red-600" : "ring-lightGray"
                  } placeholder:text-lightGray focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                >
                  <input
                    style={{ outline: "none" }}
                    id="email_address"
                    name="email_address"
                    type="email"
                    value={values.email_address}
                    onChange={handleChange("email_address")}
                    onBlur={handleBlur("email_address")}
                    autoComplete="email_address"
                    placeholder="Email Address"
                    className="block w-full outline-none bg-inherit m-1 "
                  />
                </div>
              </div>
              {errors.email_address ? (
                <p className="text-[10px] text-red-600 font-semibold mt-1 font-poppins">
                  {errors.email_address}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="mt-4">
              <div>
                <div className="text-[12px] pl-0.5 pb-1 font-poppins">
                  Password
                </div>
                <div
                  className={`flex align-bottom w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset ring-lightGray ${
                    errors.password ? "ring-red-600" : "ring-lightGray"
                  } placeholder:text-lightGray focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                >
                  <input
                    id="password"
                    name="password"
                    type={openEye ? "password" : "text"}
                    autoComplete="password"
                    value={values.password}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Password"
                    className="block w-full outline-none bg-inherit m-1 "
                  />
                  {openEye ? (
                    <div
                      onClick={handleEyeOpen}
                      className="block mt-0 p-2 mr-2 cursor-pointer"
                    >
                      <AiFillEyeInvisible className="text-[20px] text-lightGray" />
                    </div>
                  ) : (
                    <div
                      onClick={handleEyeOpen}
                      className="block mt-0 p-2 mr-2 cursor-pointer"
                    >
                      <AiFillEye className="text-[20px] text-lightGray" />
                    </div>
                  )}
                </div>
              </div>
              {errors.password ? (
                <p className="text-[10px] text-red-600 font-semibold mt-1 font-poppins">
                  {errors.password}
                </p>
              ) : (
                ""
              )}
            </div>

            <div className="w-full">
              <Button
                authButton={true}
                text="Continue"
                isLoading={isLoading}
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="mt-2"
              />
            </div>
            <div className="w-full text-center text-[13px] mt-2 font-poppins">
              Don’t have an account?{" "}
              <button
                onClick={() => setModalType("signup")}
                className="text-purple"
              >
                Signup Here
              </button>
            </div>
          </form>
        </div> */}
      </div>
    </>
  );
};

export default SignIn;
