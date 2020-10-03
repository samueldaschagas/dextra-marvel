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
  favorites: number[];
  isMobile: boolean;
  item: TComic;
  itemType: string;
  onClick(comicId: number): void;
  onSetFavorites(favorites: number[]): void;
};

export default function Comic({
  favorites,
  isMobile,
  item,
  itemType,
  onSetFavorites,
  onClick,
}: TComicProps) {
  const { addToast } = useToasts();

  function handleFavoriteClick(itemId: number) {
    addToast('You marked this item as a "Favorite"', { appearance: 'success' });
    onSetFavorites(favorites.concat([itemId]));
  }

  function handleRemoveFavoriteClick(itemId: number) {
    addToast('Removed from items marked as "Favorite"', {
      appearance: 'success',
    });
    onSetFavorites(favorites.filter((favoriteId) => favoriteId !== itemId));
  }

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
            {!favorites.includes(item.id) ? (
              <AiOutlineHeart
                className="comic__details__favorite-icon"
                data-tip
                data-for="favorite"
                onClick={() => handleFavoriteClick(item.id)}
              />
            ) : (
              <AiFillHeart
                className="comic__details__remove-favorite-icon"
                data-tip
                data-for="removeFavorite"
                onClick={() => handleRemoveFavoriteClick(item.id)}
              />
            )}
            <ReactTooltip id="favorite" place="top" effect="solid">
              Mark as "Favorite"
            </ReactTooltip>
            <ReactTooltip id="removeFavorite" place="top" effect="solid">
              Remove "Favorite"
            </ReactTooltip>
          </div>
        </div>
      </div>
    </>
  );
}
