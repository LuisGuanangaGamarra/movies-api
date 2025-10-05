export type Role = 'ADMIN' | 'REGULAR';

export type RegisterUserInputDTO = {
  email: string;
  password: string;
  role: Role;
};
