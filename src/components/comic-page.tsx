import md5 from 'js-md5';
import React, { useEffect, useState } from 'react';
import { Col, Container as GridSystemContainer, Row } from 'react-grid-system';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link, RouteComponentProps } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { useToasts } from 'react-toast-notifications';
import api from '../api';
import { CharacterDetails } from './character-details';
import { ComicDetails } from './comic-details';
import './comic-page.scss';
import { Container } from './container/container';
import { PageHeader } from './page-header/page-header';

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
      {loadingComic && (
        <BarLoader
          width="100%"
          height={4}
          color="#ef4f21"
        />
      )}
      <Container>
        <div style={{ textAlign: "left", padding: "0 25px" }}>
          <Link to={`/${itemType}`}><AiOutlineArrowLeft style={{ margin: "0 3px -3px 0" }} /> Back To {isComics ? "Comics" : "Characters"}</Link>
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
                {isComics ? <ComicDetails comic={comic}/> : <CharacterDetails comic={comic}/>}
              </Col>
            </Row>
          </GridSystemContainer>
        )}
      </Container>
    </>
  );
} 