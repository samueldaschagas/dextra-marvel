import _ from 'lodash';
import { TComic, TCreatorsItem } from 'pages/types';
import React from 'react';
import { Col, Row } from 'react-grid-system';
import './ComicDetails.scss';

type TComicDetailsProps = {
  comic?: TComic;
};

/**
 * Componente responsável pela exibição dos detalhes de um quadrinho.
 */
export function ComicDetails({ comic }: TComicDetailsProps) {
  const comicCreators = _.get(comic, 'creators.items') || [];
  const comicPrice = _.get(comic, 'prices.0.price');

  return (
    <>
      <ul className="comic-details">
        <li>{comic?.description}</li>
        <li>
          <Row>
            <Col sm={4} className="comic-details__col">
              <strong>Pages number:</strong> {comic?.pageCount || '--'}
            </Col>
            <Col sm={8} className="comic-details__col">
              <strong>Format:</strong> {comic?.format || '--'}
            </Col>
          </Row>
        </li>
        <li>
          <Row>
            <Col sm={4} className="comic-details__col">
              <strong>ISBN:</strong> {comic?.isbn || '--'}
            </Col>
            <Col sm={8} className="comic-details__col">
              <strong>ISSN:</strong> {comic?.issn || '--'}
            </Col>
          </Row>
        </li>
        <li>
          <strong>Creators:</strong>
          <Row>
            {!_.isEmpty(comicCreators) ? (
              comicCreators.map((c: TCreatorsItem) => (
                <Col sm={4} className="comic-details__col">
                  <div>{c.name}</div>
                  <div className="comic-details__rule">{c.role}</div>
                </Col>
              ))
            ) : (
              <Col sm={4}>--</Col>
            )}
          </Row>
        </li>
      </ul>
      <div className="comic-details__price">
        {comicPrice ? `$${comicPrice}` : 'Value Unavailable'}
      </div>
    </>
  );
}
