export const EMAIL_REG_EXP =
  /^[a-zA-Z._%+-][a-zA-Z0-9._%+-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export const RE_validation = [
  {
    re: /(?=.*[a-z])/,
    validateMessage: "At least 1 lowercase letter",
  },
  {
    re: /(?=.*[A-Z])/,
    validateMessage: "At least 1 UPPERCASE letter",
  },
  {
    re: /(?=.*\d)/,
    validateMessage: "At least 1 number",
  },
  {
    re: /(.{6,15})/,
    validateMessage: " At least 6 characters",
  },
];
