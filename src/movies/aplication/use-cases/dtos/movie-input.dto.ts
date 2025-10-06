export class MovieInputDto {
  readonly id?: number;
  readonly title?: string;
  readonly director?: string;
  readonly releaseDate?: Date;
  readonly synopsis?: string;
  readonly externalId?: string;
}
