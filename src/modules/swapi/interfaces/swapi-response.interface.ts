export interface SwapiFilmProperties {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  url: string;
  created: string;
  edited: string;
}

export interface SwapiFilmItem {
  properties: SwapiFilmProperties;
  uid: string;
  _id: string;
}

export interface SwapiResponse<T> {
  message: string;
  result: T;
}
