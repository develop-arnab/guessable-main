import * as yup from "yup";
import { EMAIL_REG_EXP } from "../utils/regix";

export const signInValidationSchema = yup.object().shape({
  email_address: yup
    .string()
    .email("Please enter a valid email")
    .trim()
    .min(6, "too short")
    .max(140, "too long")
    .matches(EMAIL_REG_EXP, "Please enter a valid email")
    .required("*Email is required"),
  password: yup
    .string()
    .min(8, "too short")
    .max(80, "too long")
    .required("*Please enter your password"),
});

export const signUpValidationSchema = yup.object().shape({
  full_name: yup.string().required("*Please enter your Name"),
  email_address: yup
    .string()
    .email("Please enter a valid email")
    .trim()
    .min(6, "too short")
    .max(140, "too long")
    .matches(EMAIL_REG_EXP, "Please enter a valid email")
    .required("*Please enter an email"),
  password: yup
    .string()
    .min(8, "too short")
    .max(80, "too long")
    .required("*Please enter your password"),
  confirm_password: yup
    .string()
    .required("*Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const setSelectOptions = yup.object().shape({
  option: yup.string().required("*Please select a option"),
});

export const setPasswordValidationSchema = yup.object().shape({
  password: yup
    .string()
    .matches(
      /[a-z]/,
      "Please make sure the password meets all of the criteria below.",
    )
    .matches(
      /[A-Z]/,
      "Please make sure the password meets all of the criteria below.",
    )
    .matches(
      /\d/,
      "Please make sure the password meets all of the criteria below.",
    )
    .min(6, "Please make sure the password meets all of the criteria below.")
    .required("Please enter your new password"),
});

export const aboutUserValidationSchema = yup.object().shape({
  full_name: yup.string(),
  first_name: yup.string().required("Please enter your first name"),
  last_name: yup.string().required("Please enter your last name"),
  email_address: yup
    .string()
    .email("Please enter a valid email")
    .trim()
    .matches(EMAIL_REG_EXP, "Please enter a valid email")
    .required("Please enter your email address"),
  phone_number: yup.string().required("Please enter your phone number"),
  status: yup.string().required("Please enter your status"),
});

export const accountVerificationSchema = yup.object().shape({
  email_address: yup
    .string()
    .email("Please enter a valid email")
    .trim()
    .min(6, "too short")
    .max(140, "too long")
    .matches(EMAIL_REG_EXP, "Please enter a valid email")
    .required("*Email is required"),
});

export const supportVerificationSchema = yup.object().shape({
  email_address: yup
    .string()
    .email("Please enter a valid email")
    .trim()
    .matches(EMAIL_REG_EXP, "Please enter a valid email")
    .required("*Email is required"),
  subject: yup.string().required("*Subject is required"),
  message: yup.string().required("*Message is required"),
});

export const appUserFilter = yup.object().shape({
  sortBy: yup.string(),
  userStatus: yup.string(),
  lastActive: yup.string(),
});
