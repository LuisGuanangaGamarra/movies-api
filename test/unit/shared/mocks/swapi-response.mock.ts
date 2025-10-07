import { SawpiResponseDTO } from '../../../../src/movies/infra/swapi/types';

export const mockSwapiResponse: SawpiResponseDTO = {
  result: [
    {
      properties: {
        title: 'Star Wars: Episode IV',
        director: 'George Lucas',
        release_date: '1977-05-25',
        opening_crawl: 'A long time ago in a galaxy far, far away...',
      },
      _id: '1',
    },
  ],
};
