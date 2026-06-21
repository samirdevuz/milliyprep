export const AUTH_FLAGS = {
  email:
    process.env.NEXT_PUBLIC_ENABLE_EMAIL_AUTH === undefined ||
    process.env.NEXT_PUBLIC_ENABLE_EMAIL_AUTH === "true",
  phone:
    process.env.NEXT_PUBLIC_ENABLE_PHONE_AUTH === undefined ||
    process.env.NEXT_PUBLIC_ENABLE_PHONE_AUTH === "true",
};
