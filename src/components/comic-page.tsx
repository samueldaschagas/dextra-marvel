import React from 'react';
import { Container } from 'react-grid-system';
import { BarLoader } from 'react-spinners';
import '../App.scss';
import './comic.scss';
import { PageHeader } from './page-header/page-header';

type TThumbnail = { 
    extension: string;
    path: string;
};
  
type TComic = {
    title: string;
    thumbnail: TThumbnail;
};

type TComicProps = {
    item: TComic;
};

export default function ComicPage({ item }: TComicProps) {
  return (
    <>
      <div className="header__img-wrapper">
        <img 
          src="./images/comics-banner.jpg" 
          className="header__img-banner"
          alt="Banner Quadrinhos"
        />
      </div>
      {false && (
        <BarLoader
          width="100%"
          height={4}
          color="#ef4f21"
        />
      )}
      <Container>
        <PageHeader title="Quadrinhos" />
        Item
      </Container>
    </>
  );
} 