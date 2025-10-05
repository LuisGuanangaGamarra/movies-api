import axios from 'axios';
import { ISwapiClient } from './swapi';
import { SawpiResponseDTO } from './types';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SwapiClient implements ISwapiClient {
  constructor(private readonly configService: ConfigService) {}

  async fetchFilms() {
    const swapiUrl = this.configService.get<string>('SWAPI_URL', '');
    try {
      const result = await axios.get<SawpiResponseDTO>(swapiUrl);
      return result?.data ?? null;
    } catch {
      return null;
    }
  }
}
