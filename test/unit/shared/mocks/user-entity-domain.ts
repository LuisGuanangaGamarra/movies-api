export const userEntityDomainMock = {
  id: 1,
  email: 'test@mail.com',
  passwordHash: 'hashed_password',
  role: {
    id: 2,
    name: 'ADMIN',
    permission: [
      {
        id: 1,
        name: 'CREATE_MOVIE',
      },
      {
        id: 2,
        name: 'UPDATE_MOVIE',
      },
    ],
  },
};
