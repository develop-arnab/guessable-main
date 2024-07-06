export const API_URL = import.meta.env.VITE_API_URL;
export const DOMAIN = import.meta.env.VITE_DOMAIN;
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
export const JWT_SECRET = import.meta.env.JWT_SECRET;
export const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const options = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "disabled",
    label: "Disabled",
  },
  {
    value: "blocked",
    label: "Blocked",
  },
];

export const generateRandomDateInRange = () => {
  const today = new Date();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sixtyDaysBeforeYesterday = new Date(yesterday);
  sixtyDaysBeforeYesterday.setDate(sixtyDaysBeforeYesterday.getDate() - 60);

  const randomTime =
    Math.random() * (yesterday.getTime() - sixtyDaysBeforeYesterday.getTime()) +
    sixtyDaysBeforeYesterday.getTime();
  const randomDate = new Date(randomTime);

  const year = randomDate.getFullYear();
  const month = randomDate.getMonth() + 1;
  const day = randomDate.getDate();

  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  return formattedDate;
};

export const convertToYYYYMMDD = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getUTCTime = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timeZone;
};
