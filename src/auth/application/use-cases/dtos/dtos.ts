export type Role = 'ADMIN' | 'REGULAR';

export type LoginInputDTO = { email: string; password: string };
export type RegisterInputDTO = LoginInputDTO & { role: Role };
export type LoginOutputDTO = { token: string };
