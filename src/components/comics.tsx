import md5 from 'js-md5';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Col,
  Container as GridSystemContainer,
  Row,
  useScreenClass,
  Visible,
} from 'react-grid-system';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { RouteComponentProps } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { useToasts } from 'react-toast-notifications';
import api from '../api';
import '../App.scss';
import Comic from './comic';
import { Container } from './container/container';
import { PageHeader } from './page-header/page-header';

type TThumbnail = {
  extension: string;
  path: string;
};

type TComic = {
  id: number;
  title: string;
  thumbnail: TThumbnail;
  favoritedSince: Date;
};

type TComicsProps = RouteComponentProps & {
  title: string;
};

const PUBLIC_KEY = '4ee2cb620530c8a433645ce054a014cb';
const PRIVATE_KEY = '3a391728aa873a351b28c250786cbb300cf6e303';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Comics({
  history,
  title,
  match: { path },
}: TComicsProps) {
  const { addToast } = useToasts();
  const [loadingItems, setLoadingItems] = useState(false);
  const [items, setItems] = useState<TComic[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [offSet, setOffSet] = useState(0);
  const itemType = path.replace('/', '');
  const isComics = itemType === 'comics';
  const LOCAL_STORAGE_KEY = `@dextra-marvel/favorites-${
    isComics ? 'comics' : 'characters'
  }`;

  useEffect(() => {
    setOffSet(0);
    setSelectedPage(0);
    setFavorites(
      JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
    );
    setIsShowOnlyFavorites(false);
    const inputSearchText = document.getElementById(
      'searchText'
    ) as HTMLInputElement;

    if (inputSearchText) {
      inputSearchText.value = '';
    }
    setSearchText('');
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType]);

  async function fetchData(searchText?: string) {
    setLoadingItems(true);
    try {
      const timestamp = Number(new Date());
      const hash = md5.create();
      hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);

      const comicsUrl = `comics?ts=${timestamp}&orderBy=title&offset=${offSet}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`.concat(
        searchText ? `&titleStartsWith=${searchText}` : ''
      );
      const charactersUrl = `characters?ts=${timestamp}&orderBy=name&offset=${offSet}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`.concat(
        searchText ? `&nameStartsWith=${searchText}` : ''
      );

      const {
        data: {
          data: { results, total },
        },
      } = await api.get(isComics ? comicsUrl : charactersUrl);
      setItems(results);

      if (total > 0) {
        const totalPages = total / 20; // TODO: Criar constante
        setTotalPages(totalPages);
      }
    } catch (error) {
      addToast(error.message, { appearance: 'error' });
    } finally {
      setLoadingItems(false);
    }
  }

  useEffect(() => {
    fetchData(selectedFirstLetter || searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offSet]);

  function handlePageClick(data: { selected: number }) {
    window.scrollTo(0, 0);

    const selected = data.selected;
    const selectedOffSet = Math.ceil(selected * 20);

    setSelectedPage(selected);
    setOffSet(selectedOffSet);
  }

  /* 
    Referência utilizada para armazenar os favoritos em localStorage com react hook:
    https://egghead.io/lessons/react-store-values-in-localstorage-with-the-react-useeffect-hook 
  */
  const initialFavorites = () =>
    JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  const [favorites, setFavorites] = useState(initialFavorites);

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites.length]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    
    setOffSet(0);
    setSelectedPage(0);
    setSelectedFirstLetter("");
    fetchData(searchText);
  }

  function handleItemClick(id: number) {
    history.push(`/${itemType}/${id}`);
  }

  const [selectedFirstLetter, setSelectedFirstLetter] = useState('');

  function handleFilterByLetter(letter: string) {
    if (letter !== selectedFirstLetter) {
      setOffSet(0);
      setSelectedPage(0);
      const inputSearchText = document.getElementById(
        'searchText'
      ) as HTMLInputElement;

      if (inputSearchText) {
        inputSearchText.value = '';
      }
      setSearchText('');
      setSelectedFirstLetter(letter);
      fetchData(letter);
    }
  }

  const screenClass = useScreenClass();
  const isMobile = ['xs', 'sm', 'md'].includes(screenClass);
  const [isShowOnlyFavorites, setIsShowOnlyFavorites] = useState(false);

  function renderItems() {
    return (
      <GridSystemContainer>
        <Row>
          {!loadingItems &&
            (isShowOnlyFavorites && !_.isEmpty(favorites)
              ? favorites
              : items
            ).map((item: TComic) => (
              <Col className="comics__col" xl={3} lg={4} md={6} key={item.id}>
                <Comic
                  item={item}
                  favorites={favorites}
                  onClick={handleItemClick}
                  onSetFavorites={setFavorites}
                  onSetIsShowOnlyFavorites={setIsShowOnlyFavorites}
                  itemType={itemType}
                  isMobile={isMobile}
                />
              </Col>
            ))}
          {items.length === 0 && !loadingItems && 'No results found'}
        </Row>
        {items.length > 0 && !isShowOnlyFavorites && (
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            breakClassName="break-me"
            pageCount={totalPages}
            forcePage={selectedPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName="pagination"
            activeClassName="active"
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
      {loadingItems && <BarLoader width="100%" height={4} color="#ef4f21" />}
      <Container>
        <PageHeader title={title} />
        <div className="comics__actions-bar">
          <form
            className={
              isMobile ? 'comics__mobile-search-form' : 'comics__search-form'
            }
            onSubmit={handleSearchSubmit}
          >
            <input
              id="searchText"
              onChange={handleSearchChange}
              placeholder={`Search by ${isComics ? 'title' : 'name'}...`}
            />
            {searchText ? (
              <AiOutlineClose
                className={
                  isMobile
                    ? 'comics__mobile-search-form-close-icon'
                    : 'comics__search-form-close-icon'
                }
                onClick={() => {
                  const inputSearchText = document.getElementById(
                    'searchText'
                  ) as HTMLInputElement;

                  if (inputSearchText) {
                    inputSearchText.value = '';
                  }
                  setSearchText('');
                  fetchData();
                  setOffSet(0);
                }}
              />
            ) : (
              <AiOutlineSearch
                className={
                  isMobile
                    ? 'comics__mobile-search-form-search-icon'
                    : 'comics__search-form-search-icon'
                }
              />
            )}
            <button type="submit" disabled={loadingItems || !searchText}>
              Search
            </button>
          </form>
          <div className="comics__more-actions">
            <Row>
              <Col>
                <button
                  className="btn"
                  onClick={() => {
                    setIsShowOnlyFavorites(!isShowOnlyFavorites);
                    const inputSearchText = document.getElementById(
                      'searchText'
                    ) as HTMLInputElement;

                    if (inputSearchText) {
                      inputSearchText.value = '';
                    }
                    setSearchText('');
                  }}
                  disabled={_.isEmpty(favorites)}
                >
                  {isShowOnlyFavorites
                    ? 'Show All'
                    : `Show Only Favorites (${favorites.length})`}
                </button>
              </Col>
              <Col>
                <button
                  className="btn"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Do you really want to remove all ${
                          isComics ? 'comics' : 'characters'
                        } marked as "Favorite"? This operation cannot be undone.`
                      )
                    ) {
                      setFavorites([]);
                      setIsShowOnlyFavorites(false);
                      addToast('Favorites have been removed', {
                        appearance: 'success',
                      });
                    }
                  }}
                  disabled={_.isEmpty(favorites)}
                >
                  Clear Favorites
                </button>
              </Col>
            </Row>
            <Visible md sm xs>
              <hr />
            </Visible>
          </div>
        </div>
        <div className="comics__filter-first-letter">
          <label>Filter by first letter:</label>
          {ALPHABET.map((letter) => (
            <a
              className={
                selectedFirstLetter === letter
                  ? 'comics__selected-first-letter'
                  : ''
              }
              onClick={() => handleFilterByLetter(letter)}
            >
              {letter}
            </a>
          ))}
          <button className="btn" onClick={() => handleFilterByLetter('')}>
            Clear Filter
          </button>
        </div>
        {renderItems()}
      </Container>
    </>
  );
}
