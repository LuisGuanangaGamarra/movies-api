import { SawpiResponseDTO } from './types';

export interface ISwapiClient {
  fetchFilms(): Promise<SawpiResponseDTO | null>;
}

export const SWAPI_CLIENT = Symbol('SWAPI_CLIENT');
