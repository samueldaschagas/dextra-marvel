import _ from 'lodash';
import { TComicCharacter } from 'pages/types';
import React from 'react';
import { AiOutlineLink } from 'react-icons/ai';
import './CharacterDetails.scss';

type TCharacterDetailsProps = {
  character?: TComicCharacter;
};

/**
 * Componente responsável pela exibição dos detalhes de um personagem.
 */
export function CharacterDetails({ character }: TCharacterDetailsProps) {
  // Armazena na constante 'detailUrl' apenas url do tipo 'detail' para ser utilizada em link 'More Details'
  const detailUrl =
    _.get(character, 'urls.0.type') === 'detail' &&
    _.get(character, 'urls.0.url');

  return (
    <>
      <p className="character-details__description">
        {character?.description || <em>No description</em>}
      </p>
      {detailUrl && (
        <a
          className="character-details__detail-url"
          href={detailUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiOutlineLink className="character-details__icon-link" />
          More Details
        </a>
      )}
    </>
  );
}
