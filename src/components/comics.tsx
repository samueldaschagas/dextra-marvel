import React, { useEffect, useState } from 'react';
import { PageHeader } from './page-header/page-header';
import '../App.scss';
import Comic from './comic';
import api from '../api';
import md5 from 'js-md5';
import { useToasts } from 'react-toast-notifications';
import { BarLoader } from 'react-spinners';
import { Container } from './container/container';
import {
  Container as GridSystemContainer,
  Col,
  Row,
  useScreenClass,
} from 'react-grid-system';
import ReactPaginate from 'react-paginate';
import { RouteComponentProps } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import _, { isEmpty } from 'lodash';

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

  useEffect(() => {
    setOffSet(0);
    setSelectedPage(0);
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
    fetchData(searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offSet]);

  function handlePageClick(data: { selected: number }) {
    window.scrollTo(0, 0);

    const selected = data.selected;
    const selectedOffSet = Math.ceil(selected * 20);

    setSelectedPage(selected);
    setOffSet(selectedOffSet);
  }

  const initialFavorites = () =>
    JSON.parse(window.localStorage.getItem('@dextra-marvel/favorites') || '[]');
  const [favorites, setFavorites] = useState(initialFavorites);

  useEffect(() => {
    window.localStorage.setItem(
      '@dextra-marvel/favorites',
      JSON.stringify(favorites)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites.length]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    fetchData(searchText);
  }

  function handleItemClick(id: number) {
    history.push(`/${itemType}/${id}`);
  }

  const screenClass = useScreenClass();
  const isMobile = ['xs', 'sm'].includes(screenClass);
  const [isShowOnlyFavorites, setIsShowOnlyFavorites] = useState(false);

  function renderItems() {
    return (
      <GridSystemContainer>
        <div className="comics__actions-bar">
          <form
            className={
              isMobile ? 'comics__mobile-search-form' : 'comics__search-form'
            }
            onSubmit={handleSubmit}
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
            <button
              className="btn"
              style={{ marginRight: '15px' }}
              onClick={() => {
                setIsShowOnlyFavorites(!isShowOnlyFavorites);
              }}
              disabled={_.isEmpty(favorites)}
            >
              {isShowOnlyFavorites ? 'Show All' : 'Show Only Favorites'}
            </button>
            <button
              className="btn"
              onClick={() => {
                if (
                  window.confirm(
                    'Do you really want to remove all items marked as "Favorite"? This operation cannot be undone.'
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
          </div>
        </div>
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
        {renderItems()}
      </Container>
    </>
  );
}
