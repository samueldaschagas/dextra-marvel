import { formatDistance } from 'date-fns';
import { TComicCharacter } from 'pages/types';
import React from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useToasts } from 'react-toast-notifications';
import ReactTooltip from 'react-tooltip';
import './ItemCard.scss';

type TItemCardProps = {
  favorites: TComicCharacter[];
  isMobile: boolean;
  item: TComicCharacter & { favoritedSince: Date };
  itemType: string;
  showTooltips: boolean;
  onSetShowTooltips(showTooltips: boolean): void;
  onClick(itemId: number): void;
  onSetFavorites(favorites: TComicCharacter[]): void;
};

/**
 * Componente responsável pela exibição do card com imagem, nome/título
 * e opções de favorito do item (Quadrinho ou Personagem).
 */
export default function ItemCard({
  favorites,
  isMobile,
  item,
  itemType,
  showTooltips,
  onSetShowTooltips,
  onSetFavorites,
  onClick,
}: TItemCardProps) {
  // Inicializa notificação addToast
  const { addToast } = useToasts();

  function handleFavoriteClick(item: TComicCharacter) {
    // Atualiza state 'showTooltips' para forçar a atualização dos tooltips após o click
    onSetShowTooltips(false);

    // Atualiza state 'favorites' com o novo item escolhido, passando a data atual para ser exibida no card
    onSetFavorites(favorites.concat([{ ...item, favoritedSince: new Date() }]));

    addToast('You marked this item as a "Favorite"', { appearance: 'success' });
  }

  function handleRemoveFavoriteClick(itemId: number) {
    // Atualiza state 'showTooltips' para forçar a atualização dos tooltips após o click
    onSetShowTooltips(false);

    // Atualiza state 'favorites' removendo o item escolhido
    const filteredFavorites = favorites.filter((f) => f.id !== itemId);
    onSetFavorites(filteredFavorites);

    addToast('Removed from items marked as "Favorite"', {
      appearance: 'success',
    });
  }

  const favoritedItem = favorites.find((f) => f.id === item.id);

  return (
    <>
      <div className={isMobile ? 'item-card-mobile' : 'item-card'}>
        <img
          src={`${item.thumbnail.path}/${
            isMobile ? 'portrait_uncanny' : 'standard_fantastic'
          }.${item.thumbnail.extension}`}
          alt={`${item[itemType === 'comics' ? 'title' : 'name']}`}
          onClick={() => onClick(item.id)}
        />
        <div className="item-card__info">
          <div
            className="item-card__info__name"
            onClick={() => onClick(item.id)}
          >
            {item[itemType === 'comics' ? 'title' : 'name']}
          </div>
          <div className="item-card__info__footer">
            <span className="item-card__info__favorited-since">
              {favoritedItem && (
                <>
                  Favorited at{' '}
                  {formatDistance(
                    new Date(favoritedItem.favoritedSince),
                    new Date()
                  )}
                </>
              )}
            </span>
            {!favoritedItem ? (
              <AiOutlineHeart
                className="item-card__info__favorite-icon"
                data-tip
                data-for="favorite"
                onClick={() => handleFavoriteClick(item)}
              />
            ) : (
              <AiFillHeart
                className="item-card__info__remove-favorite-icon"
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
