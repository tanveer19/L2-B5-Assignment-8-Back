import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import prisma from "../../config/prisma";
import { createUserTokens } from "../../utils/userTokens";

type Role = "USER" | "ADMIN";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role?: Role; // optional, defaults to USER
}

interface LoginPayload {
  email: string;
  password: string;
}

export const AuthService = {
  // -------------------------------
  // REGISTER USER
  // -------------------------------
  registerUser: async (payload: RegisterPayload) => {
    const { fullName, email, password, role } = payload;

    // Check if email already exists
    const isExist = await prisma.user.findUnique({ where: { email } });
    if (isExist) {
      throw new AppError(400, "User already exists");
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Ensure role is uppercase and valid
    const roleEnum: Role = role ? (role.toUpperCase() as Role) : "USER";

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashed,
        role: roleEnum,
      },
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  },

  // -------------------------------
  // LOGIN USER
  // -------------------------------
  loginUser: async (payload: LoginPayload) => {
    const { email, password } = payload;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(404, "User not found");
    }
    if (user.isBlocked) {
      throw new Error("Your account is blocked. Contact admin.");
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(400, "Invalid credentials");
    }

    // Generate JWT with role
    const accessToken = createUserTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  },
};
