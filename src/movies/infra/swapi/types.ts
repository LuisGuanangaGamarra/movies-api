export type Properties = {
  title: string;
  director: string;
  release_date: string;
  opening_crawl: string;
};

export type Result = {
  properties: Properties;
  _id: string;
};

export type SawpiResponseDTO = {
  result: Result[];
};
