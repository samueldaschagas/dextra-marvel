import React from 'react';
import './comic.scss';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import ReactTooltip from 'react-tooltip';

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
    item: TComic;
    itemType: string;
    onClick(comicId: number): void;
};

export default function Comic({ item, itemType, onClick }: TComicProps) {
    return (
        <>
            <div className="comic" onClick={() => onClick(item.id)}>
              <img 
                src={`${item.thumbnail.path}/standard_fantastic.${item.thumbnail.extension}`} 
                alt={`${item[itemType === 'comics' ? 'title' : 'name']}`} 
                />
              <div className="comic__details">
                <div className="comic__details__name">{item[itemType === 'comics' ? 'title' : 'name']}</div>
                <div className="comic__details__footer">
                    {true ? 
                        <AiOutlineHeart style={{ fontSize: '20px' }} data-tip data-for="favorite" /> : 
                        <AiFillHeart style={{ fontSize: '20px', color: "red" }} data-tip data-for="removeFavorite" />  
                    }
                    <ReactTooltip id="favorite" place="bottom" effect="solid">
                        Favorite
                    </ReactTooltip>
                    <ReactTooltip id="removeFavorite" place="bottom" effect="solid">
                        Remove Favorite
                    </ReactTooltip>
                </div>
              </div>
            </div>
        </>
    )
} 