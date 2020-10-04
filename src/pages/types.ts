type TCreatorsItem = {
  name: string;
  role: string;
};

type TCreators = {
  items: TCreatorsItem[];
};

type TPrice = {
  price: number;
};

type TThumbnail = {
  extension: string;
  path: string;
};

type TUrl = {
  type: string;
  url: string;
};

export type TComic = {
  creators: TCreators;
  description: string;
  favoritedSince: Date;
  format: string;
  id: number;
  isbn: string;
  issn: string;
  name: string;
  pageCount: number;
  prices: TPrice[];
  thumbnail: TThumbnail;
  title: string;
  urls: TUrl[];
};
