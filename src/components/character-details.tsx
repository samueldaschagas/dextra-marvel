import React from 'react';
import _ from 'lodash';
import { AiOutlineLink } from "react-icons/ai";

type TThumbnail = { 
  extension: string;
  path: string;
};

type TCreators = {
items: { name: string; role: string; }[];
};

type TComic = {
    description: string;
    format: string;
    isbn: string;
    issn: string;
    title?: string;
    name?: string;
    thumbnail: TThumbnail;
    pageCount: number;
    prices: { price: number }[]
    creators: TCreators;
    urls: { url: string; type: string; }[];
};

type TComicDetailsProps = {
  comic?: TComic;
};

export function CharacterDetails({comic}: TComicDetailsProps) {
  const detailUrl = _.get(comic, 'urls.0.type') === "detail" && _.get(comic, 'urls.0.url');

  return (
    <>
        <p style={{ textAlign: 'justify' }}>{comic?.description || <em style={{ fontStyle: 'italic' }}>No description</em>}</p>
        {detailUrl && (
          <a 
            href={detailUrl} 
            style={{ float: 'left', marginTop: '20px' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiOutlineLink style={{ margin: "0 3px -3px 0" }} />
            More Details
          </a>
        )}
    </>
  )
}