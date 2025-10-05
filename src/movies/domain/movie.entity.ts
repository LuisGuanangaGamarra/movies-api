export class Movie {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly director: string,
    readonly releaseDate: Date,
    readonly synopsis: string,
    readonly externalId: string | null,
  ) {}
}
