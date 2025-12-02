import jwt from "jsonwebtoken";

export const createUserTokens = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
