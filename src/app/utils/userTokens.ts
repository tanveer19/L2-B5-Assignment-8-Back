import jwt from "jsonwebtoken";

export const createUserTokens = ({ id, email, role }: { id: string; email: string; role: string }) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

