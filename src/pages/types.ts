// Define tipos que são utilizados nos componentes em /pages
export type TCreatorsItem = {
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
  pageCount: number;
  prices: TPrice[];
  thumbnail: TThumbnail;
  title: string;
};

export type TCharacter = {
  description: string; 
  id: number;
  name: string;
  thumbnail: TThumbnail;
  urls: TUrl[];
} 

export type TComicCharacter = TComic & TCharacter;



