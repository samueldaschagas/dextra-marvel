import axios from 'axios';
import md5 from 'js-md5';
import { FetchItemsPars } from 'pages/types';
import { BASE_URL, PRIVATE_KEY, PUBLIC_KEY } from './constants';

const api = axios.create({
  baseURL: BASE_URL,
});

const timestamp = Number(new Date());
const hash = md5.create();
hash.update(timestamp + PRIVATE_KEY! + PUBLIC_KEY!);

export async function fetchComics({ offset, searchText }: FetchItemsPars) {
  return await api.get(
    `comics?ts=${timestamp}&orderBy=title&offset=${offset}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`.concat(
      searchText ? `&titleStartsWith=${searchText}` : ''
    )
  );
}

export async function fetchCharacters({ offset, searchText }: FetchItemsPars) {
  return await api.get(
    `characters?ts=${timestamp}&orderBy=name&offset=${offset}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`.concat(
      searchText ? `&nameStartsWith=${searchText}` : ''
    )
  );
}

export async function fetchCharacterById(itemId: string) {
  return await api.get(
    `characters/${itemId}?ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`
  );
}

export async function fetchComicById(itemId: string) {
  return await api.get(
    `comics/${itemId}?ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`
  );
}
