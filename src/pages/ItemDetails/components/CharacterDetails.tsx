import _ from 'lodash';
import { TComic } from 'pages/types';
import React from 'react';
import { AiOutlineLink } from 'react-icons/ai';

type TComicDetailsProps = {
  comic?: TComic;
};

export function CharacterDetails({ comic }: TComicDetailsProps) {
  const detailUrl =
    _.get(comic, 'urls.0.type') === 'detail' && _.get(comic, 'urls.0.url');

  return (
    <>
      <p style={{ textAlign: 'justify' }}>
        {comic?.description || (
          <em style={{ fontStyle: 'italic' }}>No description</em>
        )}
      </p>
      {detailUrl && (
        <a
          href={detailUrl}
          style={{ float: 'left', marginTop: '20px' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiOutlineLink style={{ margin: '0 3px -3px 0' }} />
          More Details
        </a>
      )}
    </>
  );
}
