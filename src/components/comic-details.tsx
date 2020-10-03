import React from 'react';
import { Col, Row } from 'react-grid-system';
import _ from 'lodash';

type TThumbnail = {
  extension: string;
  path: string;
};

type TCreators = {
  items: { name: string; role: string }[];
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
  prices: { price: number }[];
  creators: TCreators;
};

type TComicDetailsProps = {
  comic?: TComic;
};

export function ComicDetails({ comic }: TComicDetailsProps) {
  return (
    <>
      <ul className="comic-page__details">
        <li className="comic-page__details__description">
          {comic?.description}
        </li>
        <li>
          <Row>
            <Col sm={4} className="comic-page__details__creator">
              <strong>Pages number:</strong> {comic?.pageCount || '--'}
            </Col>
            <Col sm={8} className="comic-page__details__creator">
              <strong>Format:</strong> {comic?.format || '--'}
            </Col>
          </Row>
        </li>
        <li>
          <Row>
            <Col sm={4} className="comic-page__details__creator">
              <strong>ISBN:</strong> {comic?.isbn || '--'}
            </Col>
            <Col sm={8} className="comic-page__details__creator">
              <strong>ISSN:</strong> {comic?.issn || '--'}
            </Col>
          </Row>
        </li>
        <li>
          <strong>Creators:</strong>
          <Row>
            {comic?.creators.items.length! > 0 ? (
              comic?.creators.items.map((c) => (
                <Col sm={4} className="comic-page__details__creator">
                  <div>{c.name}</div>
                  <div className="comic-page__details__rule">{c.role}</div>
                </Col>
              ))
            ) : (
              <Col sm={4}>--</Col>
            )}
          </Row>
        </li>
      </ul>
      <div className="comic-page__details__price">
        {_.get(comic, 'prices.0.price')
          ? `$${_.get(comic, 'prices.0.price')}`
          : 'Value Unavailable'}
      </div>
    </>
  );
}
