import { SwapiClient } from 'src/movies/infra/swapi/swapi.client';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SawpiResponseDTO } from 'src/movies/infra/swapi/types';

describe('SwapiClient Unit Tests', () => {
  let swapiClient: SwapiClient;
  let configService: jest.Mocked<ConfigService>;
  let mockAxios: jest.Spied<typeof axios>;
  const mockSwapiUrl = 'https://swapi.dev/api/films/';

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as Partial<jest.Mocked<ConfigService>> as jest.Mocked<ConfigService>;

    swapiClient = new SwapiClient(configService);
    mockAxios = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchFilms', () => {
    it('should fetch films successfully and return data', async () => {
      const mockResponse: SawpiResponseDTO = {
        result: [
          {
            properties: {
              title: 'Star Wars',
              director: 'George Lucas',
              release_date: '1977-05-25',
              opening_crawl: 'A long time ago in a galaxy far, far away...',
            },
            _id: '1',
          },
        ],
      };

      mockAxios.mockResolvedValue({ data: mockResponse });
      configService.get.mockReturnValue(mockSwapiUrl);

      const result = await swapiClient.fetchFilms();

      expect(configService.get).toHaveBeenCalledWith('SWAPI_URL', '');
      expect(mockAxios).toHaveBeenCalledWith(mockSwapiUrl);
      expect(result).toEqual(mockResponse);
    });

    it('should return null if axios throws an error', async () => {
      mockAxios.mockRejectedValue(new Error('Network Error'));

      const result = await swapiClient.fetchFilms();
      configService.get.mockReturnValue('');

      expect(configService.get).toHaveBeenCalledWith('SWAPI_URL', '');
      expect(mockAxios).toHaveBeenCalledWith(undefined);
      expect(result).toBeNull();
    });

    it('should return null if data result is empty', async () => {
      const result = await swapiClient.fetchFilms();
      mockAxios.mockResolvedValue({ data: null });

      expect(configService.get).toHaveBeenCalledWith('SWAPI_URL', '');
      expect(mockAxios).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
