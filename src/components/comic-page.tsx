import React, { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import './comic-page.scss';
import api from '../api';
import { PageHeader } from './page-header/page-header';
import { Link, RouteComponentProps } from 'react-router-dom';
import md5 from 'js-md5';
import { useToasts } from 'react-toast-notifications';
import { Container as GridSystemContainer, Col, Row } from 'react-grid-system';
import { Container } from './container/container';
import { AiOutlineArrowLeft } from "react-icons/ai";
import _ from 'lodash';

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
};

type TComicProps = RouteComponentProps<{comicId: string}> & {
    item: TComic;
};

const PUBLIC_KEY = '4ee2cb620530c8a433645ce054a014cb';
const PRIVATE_KEY = '3a391728aa873a351b28c250786cbb300cf6e303';

export default function ComicPage({ match: { path = '', params: { comicId } } }: TComicProps) {
  const { addToast } = useToasts();
  const [loadingComic, setLoadingComic] = useState(false);
  const [comic, setComic] = useState<TComic>();
  var re = new RegExp("/", 'g');
  const replacedPath = path.replace(re,"").split(":");
  const itemType = replacedPath[0];
  const isComics = itemType === 'comics';
  
  useEffect(() => {
    async function fetchComic() {
      setLoadingComic(true);
      try {
        const timestamp = Number(new Date());
        const hash = md5.create()
        hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);
        const comicsUrl = `comics/${comicId}?ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`;
        const charactersUrl = `characters/${comicId}?ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`;
        
        const { data: { data: { results } }} = await api.get(
            isComics ? comicsUrl : charactersUrl
        ); 
        setComic(results[0]);
      } catch(error) {
        addToast(error.message, { appearance: 'error' })
      } finally {
        setLoadingComic(false);
      }
    }

    fetchComic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      {/* <div className="header__img-wrapper">
        <img 
          src="/images/comics-banner.jpg" 
          className="header__img-banner"
          alt="Comics Banner"
        />
      </div> */}
      {loadingComic && (
        <BarLoader
          width="100%"
          height={4}
          color="#ef4f21"
        />
      )}
      <Container>
        <div style={{ textAlign: "left", padding: "0 25px" }}>
          <Link to={`/${itemType}`}><AiOutlineArrowLeft /> Back To {isComics ? "Comics" : "Characters"}</Link>
        </div>
        <PageHeader title={(comic || {})[isComics ? 'title' : 'name']!}/>
        {!loadingComic && (
          <GridSystemContainer>
            <Row>
              <Col sm={4}>
                <img 
                  className="comic-page__img"
                  src={`${comic?.thumbnail.path}/portrait_uncanny.${comic?.thumbnail.extension}`} 
                  alt={`${comic?.title}`} 
                />
              </Col>
              <Col sm={8}>
                <ul className="comic-page__details">
                  <li className="comic-page__details__description">{comic?.description}</li>
                  <li> 
                    <Row>
                      <Col sm={4} className="comic-page__details__creator">
                        <strong>Pages number:</strong> {comic?.pageCount || "--"}
                      </Col>
                      <Col sm={8} className="comic-page__details__creator">
                        <strong>Format:</strong> {comic?.format || "--"}
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col sm={4} className="comic-page__details__creator">
                        <strong>ISBN:</strong> {comic?.isbn || "--"}
                      </Col>
                      <Col sm={8} className="comic-page__details__creator">
                        <strong>ISSN:</strong> {comic?.issn || "--"}
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <strong>Creators:</strong>
                    <Row>
                      {comic?.creators.items.length! > 0 ? (
                        comic?.creators.items.map(c => (
                          <Col sm={4} className="comic-page__details__creator">
                            <div>{c.name}</div>
                            <div className="comic-page__details__rule">{c.role}</div>
                          </Col>
                        ))
                      ) : <Col sm={4}>--</Col>}
                    </Row>
                  </li>
                </ul>
                <div className="comic-page__details__price">
                  {_.get(comic, 'prices.0.price') ? `$${_.get(comic, 'prices.0.price')}` : "Value Unavailable"}
                </div>
              </Col>
            </Row>
          </GridSystemContainer>
        )}
      </Container>
    </>
  );
} 