import React, { useEffect, useState } from 'react';
import { PageHeader } from './page-header/page-header';
import '../App.scss';
import Comic from './comic';
import api from '../api';
import md5 from 'js-md5';
import { useToasts } from 'react-toast-notifications';
import { BarLoader } from 'react-spinners';
import { Container } from './container/container';
import { Container as GridSystemContainer, Col, Row } from 'react-grid-system';
import ReactPaginate from 'react-paginate';
import { RouteComponentProps } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

type TThumbnail = { 
    extension: string;
    path: string;
  };
  
type TComic = {
    id: number;
    title: string;
    thumbnail: TThumbnail;
};

type TComicsProps = RouteComponentProps & {
    data: TComic[];
};

const PUBLIC_KEY = '4ee2cb620530c8a433645ce054a014cb';
const PRIVATE_KEY = '3a391728aa873a351b28c250786cbb300cf6e303';

export default function Comics({ history }: TComicsProps) {
  const { addToast } = useToasts();
  const [loadingComics, setLoadingComics] = useState(false);
  const [comics, setComics] = useState<TComic[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [offSet, setOffSet] = useState(0);

  async function fetchData(searchTitle?: string) {
    setLoadingComics(true);
    try {
      const timestamp = Number(new Date());
      const hash = md5.create()
      hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);
      
      const { data: { data: { results, total } }} = await api.get(
          `comics?ts=${timestamp}&offset=${offSet}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`.concat(searchTitle ? `&titleStartsWith=${searchTitle}` : "")
      ); 
      setComics(results);
      
      if (total > 0) {
        const totalPages = total / 20; // TODO: Criar constante
        setTotalPages(totalPages);
      }
    } catch(error) {
      addToast(error.message, { appearance: 'error' })
    } finally {
      setLoadingComics(false);
    }
  }

  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    fetchData(searchTitle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offSet]);

  function handlePageClick(data: { selected: number }) {
    const selected = data.selected;
    const selectedOffSet = Math.ceil(selected * 20);

    setOffSet(selectedOffSet);
  };

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTitle(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    fetchData(searchTitle);
  }

  function handleComicClick(comicId: number) {
    // history.push(`/comics/${comicId}`);
  }

  function renderItems() {
      return (
          <GridSystemContainer>
              <Row style={{ margin: '0 15px 30px 10px' }}>
                <form className="comics__search-form" onSubmit={handleSubmit}>
                  <input 
                    id="searchTitle" 
                    onChange={handleSearchChange} 
                    placeholder="Buscar por título..."
                  />
                  {searchTitle ? <AiOutlineClose style={{
                    position: "relative",
                    right: "35px",
                    fontSize: "20px",
                    top: "4px",
                    color: "#bbb",
                    cursor: "pointer"
                  }} onClick={() => {
                    const inputSearchTitle = document.getElementById("searchTitle") as HTMLInputElement;

                    if (inputSearchTitle) {
                      inputSearchTitle.value = "";
                    }
                    setSearchTitle("");
                    fetchData();
                    setOffSet(0)
                  }}/> :  <AiOutlineSearch style={{
                    position: "relative",
                    right: "35px",
                    fontSize: "20px",
                    top: "4px",
                    color: "#bbb"
                  }}/> }
                  <button 
                    type="submit" 
                    disabled={loadingComics || !searchTitle}
                  >
                    Buscar
                  </button>
                </form>
              </Row>
              <Row>
                {!loadingComics && comics.map(d => (
                  <Col className="comics__col" sm={3}>
                    <Comic item={d} onClick={handleComicClick}/>
                  </Col>
                ))}
                {comics.length === 0 && !loadingComics && "Nenhum resultado encontrado"}
              </Row>
              {comics.length > 0 && (
                <ReactPaginate
                  previousLabel="Anterior"
                  nextLabel="Próxima"
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  // subContainerClassName={'pages pagination'}
                  activeClassName={'active'}
                />
              )}
          </GridSystemContainer>
      );
  }

  return (
    <>
      <div className="header__img-wrapper">
        <img 
          src="./images/comics-banner.jpg" 
          className="header__img-banner"
          alt="Banner Quadrinhos"
        />
      </div>
      {loadingComics && (
        <BarLoader
          width="100%"
          height={4}
          color="#ef4f21"
        />
      )}
      <Container>
        <PageHeader title="Quadrinhos" />
        {renderItems()}
      </Container>
    </>
  );
} 