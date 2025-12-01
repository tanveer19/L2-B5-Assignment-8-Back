export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  id: string;
  email: string;
  fullName: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface IRegisterUser {
  fullName: string;
  email: string;
  password: string;
}
