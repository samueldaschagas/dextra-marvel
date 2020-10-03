import { format } from 'date-fns';
import _ from 'lodash';
import React from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useToasts } from 'react-toast-notifications';
import ReactTooltip from 'react-tooltip';
import './comic.scss';

type TThumbnail = {
  extension: string;
  path: string;
};

type TComic = {
  id: number;
  title?: string;
  name?: string;
  thumbnail: TThumbnail;
};

type TComicProps = {
  favorites: (TComic & { favoritedSince: Date })[];
  isMobile: boolean;
  item: TComic & { favoritedSince: Date };
  itemType: string;
  showTooltips: boolean;
  onSetShowTooltips(showTooltips: boolean): void;
  onClick(comicId: number): void;
  onSetFavorites(favorites: TComic[]): void;
  onSetIsShowOnlyFavorites(isShowOnlyFavorites: boolean): void;
};

export default function Comic({
  favorites,
  isMobile,
  item,
  itemType,
  showTooltips,
  onSetShowTooltips,
  onSetFavorites,
  onSetIsShowOnlyFavorites,
  onClick,
}: TComicProps) {
  const { addToast } = useToasts();

  function handleFavoriteClick(item: TComic) {
    onSetShowTooltips(false);
    addToast('You marked this item as a "Favorite"', { appearance: 'success' });
    onSetFavorites(favorites.concat([{ ...item, favoritedSince: new Date() }]));
  }

  function handleRemoveFavoriteClick(itemId: number) {
    onSetShowTooltips(false);
    addToast('Removed from items marked as "Favorite"', {
      appearance: 'success',
    });
    const filteredFavorites = favorites.filter((f) => f.id !== itemId);
    onSetFavorites(filteredFavorites);
    if (_.isEmpty(filteredFavorites)) {
      onSetIsShowOnlyFavorites(false);
    }
  }

  const favoritedItem = favorites.find((f) => f.id === item.id);

  return (
    <>
      <div className={isMobile ? 'comic-mobile' : 'comic'}>
        <img
          src={`${item.thumbnail.path}/${
            isMobile ? 'portrait_uncanny' : 'standard_fantastic'
          }.${item.thumbnail.extension}`}
          alt={`${item[itemType === 'comics' ? 'title' : 'name']}`}
          onClick={() => onClick(item.id)}
        />
        <div className="comic__details">
          <div
            className="comic__details__name"
            onClick={() => onClick(item.id)}
          >
            {item[itemType === 'comics' ? 'title' : 'name']}
          </div>
          <div className="comic__details__footer">
            <span className="comic__details__favorited-since">
              {favoritedItem && (
                <>
                  Favorited since{' '}
                  {format(new Date(favoritedItem.favoritedSince), 'MM/dd/yyyy')}
                </>
              )}
            </span>
            {!favoritedItem ? (
              <AiOutlineHeart
                className="comic__details__favorite-icon"
                data-tip
                data-for="favorite"
                onClick={() => handleFavoriteClick(item)}
              />
            ) : (
              <AiFillHeart
                className="comic__details__remove-favorite-icon"
                data-tip
                data-for="removeFavorite"
                onClick={() => handleRemoveFavoriteClick(item.id)}
              />
            )}
            {showTooltips && (
              <>
                <ReactTooltip id="favorite" place="top" effect="solid">
                  Mark as "Favorite"
                </ReactTooltip>
                <ReactTooltip id="removeFavorite" place="top" effect="solid">
                  Remove "Favorite"
                </ReactTooltip>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
