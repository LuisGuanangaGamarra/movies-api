export type Role = 'ADMIN' | 'REGULAR';

export type LoginInput = { email: string; password: string };
export type RegisterInput = LoginInput & { role: Role };
