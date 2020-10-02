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
    title: string;
    thumbnail: TThumbnail;
};

type TComicProps = {
    item: TComic;
    onClick(comicId: number): void;
};

export default function Comic({ item, onClick }: TComicProps) {
    return (
        <>
            <div className="comic" onClick={() => onClick(item.id)}>
              <img src={`${item.thumbnail.path}.${item.thumbnail.extension}`} alt={`${item.title}`} />
              <div className="comic__details">
                <div className="comic__details__name">{item.title}</div>
                <div className="comic__details__footer">
                    {true ? 
                        <AiOutlineHeart style={{ fontSize: '20px' }} data-tip data-for="notFavorite" /> : 
                        <AiFillHeart style={{ fontSize: '20px', color: "red" }} data-tip data-for="favorite" />  
                    }
                    <ReactTooltip id="notFavorite" place="bottom" effect="solid">
                        Tornar Favorito
                    </ReactTooltip>
                    <ReactTooltip id="favorite" place="bottom" effect="solid">
                        Remover Favorito
                    </ReactTooltip>
                </div>
              </div>
            </div>
        </>
    )
} 