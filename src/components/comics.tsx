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
    title: string;
};

const PUBLIC_KEY = '4ee2cb620530c8a433645ce054a014cb';
const PRIVATE_KEY = '3a391728aa873a351b28c250786cbb300cf6e303';

export default function Comics({ history, title, match: { path } }: TComicsProps) {
  const { addToast } = useToasts();
  const [loadingItems, setLoadingItems] = useState(false);
  const [items, setItems] = useState<TComic[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [offSet, setOffSet] = useState(0);
  const itemType = path.replace('/', '');
  const isComics = itemType === 'comics';

  async function fetchData(searchText?: string) {
    setLoadingItems(true);
    try {
      const timestamp = Number(new Date());
      const hash = md5.create()
      hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);

      const comicsUrl = `comics?ts=${timestamp}&orderBy=title&offset=${offSet}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`.concat(searchText ? `&titleStartsWith=${searchText}` : "");
      const charactersUrl = `characters?ts=${timestamp}&orderBy=name&offset=${offSet}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`.concat(searchText ? `&nameStartsWith=${searchText}` : "");
      
      const { data: { data: { results, total } }} = await api.get(
        isComics ? comicsUrl : charactersUrl
      ); 
      setItems(results);
      
      if (total > 0) {
        const totalPages = total / 20; // TODO: Criar constante
        setTotalPages(totalPages);
      }
    } catch(error) {
      addToast(error.message, { appearance: 'error' })
    } finally {
      setLoadingItems(false);
    }
  }

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData(searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offSet, itemType]);

  function handlePageClick(data: { selected: number }) {
    const selected = data.selected;
    const selectedOffSet = Math.ceil(selected * 20);

    setOffSet(selectedOffSet);
  };

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    fetchData(searchText);
  }

  function handleComicClick(comicId: number) {
    history.push(`/comics/${comicId}`);
  }

  function renderItems() {
      return (
          <GridSystemContainer>
              <Row style={{ margin: '0 15px 30px 10px' }}>
                <form className="comics__search-form" onSubmit={handleSubmit}>
                  <input 
                    id="searchText" 
                    onChange={handleSearchChange} 
                    placeholder={`Search by ${isComics ? 'title' : 'name'}...`}
                  />
                  {searchText ? <AiOutlineClose style={{
                    position: "relative",
                    right: "35px",
                    fontSize: "20px",
                    top: "4px",
                    color: "#bbb",
                    cursor: "pointer"
                  }} onClick={() => {
                    const inputSearchText = document.getElementById("searchText") as HTMLInputElement;

                    if (inputSearchText) {
                      inputSearchText.value = "";
                    }
                    setSearchText("");
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
                    disabled={loadingItems || !searchText}
                  >
                    Search
                  </button>
                </form>
              </Row>
              <Row>
                {!loadingItems && items.map((c) => (
                  <Col className="comics__col" sm={3} key={c.id}>
                    <Comic 
                      item={c} 
                      onClick={handleComicClick} 
                      itemType={itemType}
                    />
                  </Col>
                ))}
                {items.length === 0 && !loadingItems && "No results found"}
              </Row>
              {items.length > 0 && (
                <ReactPaginate
                  previousLabel="Previous"
                  nextLabel="Next"
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
          src={`./images/${itemType}-banner.jpg`} 
          className="header__img-banner"
          alt={`${title} Banner`}
        />
      </div>
      {loadingItems && (
        <BarLoader
          width="100%"
          height={4}
          color="#ef4f21"
        />
      )}
      <Container>
        <PageHeader title={title} />
        {renderItems()}
      </Container>
    </>
  );
} 