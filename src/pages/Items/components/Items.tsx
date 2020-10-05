import * as Api from 'api';
import { Container, PageHeader } from 'components';
import charactersBanner from 'images/characters-banner.jpg';
import comicsBanner from 'images/comics-banner.jpg';
import _ from 'lodash';
import { TComicCharacter } from 'pages/types';
import React, { useEffect, useState } from 'react';
import { Col, Row, useScreenClass } from 'react-grid-system';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import ReactPaginate from 'react-paginate';
import { RouteComponentProps } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { useToasts } from 'react-toast-notifications';
import ItemCard from './ItemCard';
import './Items.scss';
import LetterFilter from './LetterFilter';

type TComicsProps = RouteComponentProps & {
  title: string;
};

const MAX_ITEMS_PER_PAGE = 20;

/**
 * Componente responsável pela listagem principal de cards com os itens (Quadrinhos ou Personagens).
 */
export function Items({ history, title, match: { path } }: TComicsProps) {
  const { addToast } = useToasts();
  const itemType = path.replace('/', '');
  const isComics = itemType === 'comics';
  const LOCAL_STORAGE_KEY = `@dextra-marvel/favorites-${
    isComics ? 'comics' : 'characters'
  }`;

  const [loadingItems, setLoadingItems] = useState(false);
  const [items, setItems] = useState<TComicCharacter[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [offSet, setOffSet] = useState(0);
  const [isShowOnlyFavorites, setIsShowOnlyFavorites] = useState(false);
  const [selectedFilterLetter, setSelectedFilterLetter] = useState('');

  async function fetchItems(searchText?: string, selectedOffSet?: number) {
    setLoadingItems(true);
    try {
      const apiFetch = isComics ? Api.fetchComics : Api.fetchCharacters;
      const result = await apiFetch({
        offset: selectedOffSet || offSet,
        searchText,
      });

      // A partir do resultado retornado, pega lista de itens e total para atualizar state
      const { results, total } = _.get(result, 'data.data');
      setItems(results);
      setTotal(total);

      if (total > 0) {
        const totalPages = total / MAX_ITEMS_PER_PAGE;
        setTotalPages(totalPages);
      }
    } catch (error) {
      addToast(error.message, { appearance: 'error' });
    } finally {
      setLoadingItems(false);
    }
  }

  function resetPagination() {
    setSelectedPage(0);
    setOffSet(0);
  }

  // Limpa campo de busca
  function clearSearchInput() {
    const searchInputText = document.getElementById(
      'searchText'
    ) as HTMLInputElement;

    if (searchInputText) {
      searchInputText.value = '';
    }
    setSearchText('');
  }

  // O useEffect será acionado quando alternar entre as rotas /comics e /characters
  useEffect(() => {
    // Reinicia states
    resetPagination();
    clearSearchInput();
    setIsShowOnlyFavorites(false);
    setSelectedFilterLetter('');

    // Inicia 'favorites' com os itens favoritos que estão no localStorage, de acordo com a chave selecionada
    setFavorites(
      JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]')
    );

    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType]);

  // Ao clicar em botões da paginação, atualiza state com a página selecionada e offset
  function handlePageClick({ selected }: { selected: number }) {
    window.scrollTo(0, 0);

    const selectedOffSet = Math.ceil(selected * MAX_ITEMS_PER_PAGE);

    setSelectedPage(selected);
    // setOffSet(selectedOffSet);
    fetchItems(selectedFilterLetter || searchText, selectedOffSet);
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

  function handleSearchCloseIconClick() {
    clearSearchInput();
    resetPagination();
    fetchItems();
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    /**
     * Chama função preventDefault para evitar o recarregamento da página
     * ao teclar Enter para submeter formulário
     * */
    e.preventDefault();

    resetPagination();
    setSelectedFilterLetter('');
    setIsShowOnlyFavorites(false);

    // Chama função para buscar dados a partir do texto digitado
    fetchItems(searchText);
  }

  // Redireciona para pagina de detalhes do item
  function handleItemClick(id: number) {
    history.push(`/${itemType}/${id}`);
  }

  // Limpa filtro por letra
  function clearFilterLetter() {
    resetPagination();
    setSelectedFilterLetter('');
    fetchItems();
  }

  function handleFilterLetterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const letter = e.target.value;

    if (letter !== selectedFilterLetter) {
      resetPagination();
      setIsShowOnlyFavorites(false);
      clearSearchInput();

      // Atualiza state e busca dados que iniciam com a letra escolhida
      setSelectedFilterLetter(letter);
      fetchItems(letter);
    }
  }

  function handleShowFavoritesClick() {
    // Atualiza state isShowOnlyFavorites para renderizar ou não os favoritos
    setIsShowOnlyFavorites(!isShowOnlyFavorites);

    clearSearchInput();
    setSelectedFilterLetter('');

    if (isShowOnlyFavorites) {
      resetPagination();
      fetchItems();
    }
  }

  // Função utilizada para remover todos os favoritos por contexto (/comics ou /characters)
  function handleClearFavoritesClick() {
    if (
      window.confirm(
        `Do you really want to remove all ${
          isComics ? 'comics' : 'characters'
        } marked as "Favorite"? This operation cannot be undone.`
      )
    ) {
      setFavorites([]);
      setShowTooltips(false);
      setIsShowOnlyFavorites(false);
      resetPagination();

      addToast('Favorites have been removed', {
        appearance: 'success',
      });
    }
  }

  const screenClass = useScreenClass();
  const isMobile = ['xs', 'sm', 'md'].includes(screenClass);
  const [showTooltips, setShowTooltips] = useState(true);

  useEffect(() => {
    if (!showTooltips) {
      setShowTooltips(true);
    }
  }, [showTooltips]);

  function renderResultsFound() {
    // Renderiza texto com resultado de acordo com total de itens ou total de favoritos
    if (!isShowOnlyFavorites) {
      if (total) {
        return (
          <>
            <strong>{total}</strong> results found
          </>
        );
      } else {
        return 'No results found';
      }
    } else {
      if (_.isEmpty(favorites)) {
        return 'No favorites found';
      } else {
        return (
          <>
            <strong>{favorites.length}</strong> favorites found
          </>
        );
      }
    }
  }

  // Renderiza itens favoritados ou itens encontrados após resultado da consulta
  function renderItems() {
    return (
      <>
        <Row>
          {!loadingItems &&
            (isShowOnlyFavorites ? favorites : items).map(
              (item: TComicCharacter) => (
                <Col className="items__col" xl={3} lg={4} md={6} key={item.id}>
                  <ItemCard
                    item={item}
                    favorites={favorites}
                    onClick={handleItemClick}
                    onSetFavorites={setFavorites}
                    itemType={itemType}
                    isMobile={isMobile}
                    showTooltips={showTooltips}
                    onSetShowTooltips={setShowTooltips}
                  />
                </Col>
              )
            )}
        </Row>
        {!_.isEmpty(items) && !isShowOnlyFavorites && (
          <div style={{ textAlign: 'center' }}>
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
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <header className="items__img-wrapper">
        <img
          src={isComics ? comicsBanner : charactersBanner}
          className="items__img-banner"
          alt={`${title} Banner`}
        />
      </header>
      {loadingItems && <BarLoader width="100%" height={4} color="#ef4f21" />}
      <Container>
        <PageHeader title={title} />
        <div className="items__actions-bar">
          <form
            className={
              isMobile ? 'items__search-form--is-mobile' : 'items__search-form'
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
                    ? 'items__close-icon--is-mobile'
                    : 'items__close-icon'
                }
                onClick={handleSearchCloseIconClick}
              />
            ) : (
              <AiOutlineSearch
                className={
                  isMobile
                    ? 'items__search-icon--is-mobile'
                    : 'items__search-icon'
                }
              />
            )}
            <button
              className="button button--primary-color"
              type="submit"
              disabled={loadingItems || !searchText}
            >
              Search
            </button>
          </form>
          <div className="items__more-actions">
            <Row>
              <Col>
                <button className="button" onClick={handleShowFavoritesClick}>
                  {isShowOnlyFavorites
                    ? 'Show All'
                    : `Show Only Favorites (${favorites.length})`}
                </button>
              </Col>
              <Col>
                <button
                  className="button"
                  onClick={handleClearFavoritesClick}
                  disabled={_.isEmpty(favorites)}
                >
                  Clear Favorites
                </button>
              </Col>
            </Row>
          </div>
        </div>
        <hr />
        <div className="items__letter-filter">
          <div className="items__letter-filter__results">
            {loadingItems ? 'Loading...' : renderResultsFound()}
          </div>
          <LetterFilter
            onChange={handleFilterLetterChange}
            onClearClick={clearFilterLetter}
            selectedFilterLetter={selectedFilterLetter}
          />
        </div>
        {renderItems()}
      </Container>
    </>
  );
}
