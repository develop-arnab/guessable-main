import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../utils/constant";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "same-origin",
    prepareHeaders: (headers) => {
      headers.set("Cache-Control", "no-cache");
      const token = localStorage.getItem("token");
      if (token) {
        let newStr = token.replace(/"/g, "");
        headers.set("authorization", `Bearer ${token ? newStr : null}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "signin",
        method: "POST",
        body: credentials,
      }),
    }),
    signIn0Auth: builder.mutation({
      query: (credentials) => ({
        url: "signin-oauth",
        method: "POST",
        body: credentials,
      }),
    }),
    getQuestionsByUnAuthUser: builder.query({
      query: (query) => ({
        url: `getQuestionForUnregisteredUser/${query?.questionType}`,
        method: "GET",
      }),
    }),
    getQuestionsByAuthUser: builder.query({
      query: (query) => ({
        url: `questionForTheDay/${query?.questionType}`,
        method: "GET",
      }),
    }),
    getAllCountries: builder.query({
      query: () => ({
        url: `getAllCountries`,
        method: "GET",
      }),
    }),
    getAllMovies: builder.query({
      query: () => ({
        url: `getAllMovies`,
        method: "GET",
      }),
    }),
    getUserSelectedQuestion: builder.query({
      query: (query) => {
        return {
          url: `questionByDate/${query?.questionType}/${query?.date}`,
          method: "GET",
        };
      },
    }),
    makeAttemptForUnregisteredUser: builder.mutation({
      query: (credentials) => ({
        url: "makeAttemptForUnregisteredUser",
        method: "PUT",
        body: credentials,
      }),
    }),
    makeAttempt: builder.mutation({
      query: (credentials) => ({
        url: "makeAttempt",
        method: "PUT",
        body: credentials,
      }),
    }),
    makeOldQuestionAttempt: builder.mutation({
      query: (credentials) => ({
        url: "makeAttemptForOldQuestion",
        method: "PUT",
        body: credentials,
      }),
    }),
    getQuestionState: builder.query({
      query: (query) => {
        return {
          url: `questionStats/` + query.quesId,
          method: "GET",
        };
      },
    }),
    getUserStreak: builder.query({
      query: () => {
        return {
          url: `getStreaks`,
          method: "GET",
        };
      },
    }),
    signupWithGameData: builder.mutation({
      query: (credentials) => ({
        url: "signupWithGameData",
        method: "POST",
        body: credentials,
      }),
    }),
    signUp: builder.mutation({
      query: (credentials) => ({
        url: "signup",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
    }),
    isLoggedIn: builder.query({
      query: () => ({
        url: "isTokenExpired",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useIsLoggedInQuery,
  useLogoutMutation,
  useSignIn0AuthMutation,
  useGetQuestionsByUnAuthUserQuery,
  useGetQuestionsByAuthUserQuery,
  useGetUserSelectedQuestionQuery,
  useMakeAttemptForUnregisteredUserMutation,
  useGetQuestionStateQuery,
  useMakeAttemptMutation,
  useMakeOldQuestionAttemptMutation,
  useSignupWithGameDataMutation,
  useGetUserStreakQuery,
  useGetAllMoviesQuery,
  useGetAllCountriesQuery,
} = api;
