import * as Api from 'api';
import { Container } from 'components/Container';
import { PageHeader } from 'components/PageHeader';
import { TComicCharacter } from 'pages/types';
import React, { useEffect, useState } from 'react';
import { Col, Container as GridSystemContainer, Row } from 'react-grid-system';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Link, RouteComponentProps } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { useToasts } from 'react-toast-notifications';
import { CharacterDetails } from './CharacterDetails';
import { ComicDetails } from './ComicDetails';
import './ItemDetails.scss';

type TItemDetailsProps = RouteComponentProps<{ itemId: string }> & {
  item: TComicCharacter;
};

/**
 * Componente responsável pela consulta dos detalhes de um quadrinho ou de um personagem,
 * e por exibir layout com colunas de imagem do item e componente de detalhes.
 */
export function ItemDetails({
  match: {
    path = '',
    params: { itemId },
  },
}: TItemDetailsProps) {
  // Define se o tipo de item é um quadrinho ou um personagem a partir da rota chamada
  var re = new RegExp('/', 'g');
  const replacedPath = path.replace(re, '').split(':');
  const itemType = replacedPath[0];
  const isComics = itemType === 'comics';

  const { addToast } = useToasts();
  const [loadingItem, setLoadingItem] = useState(false);
  const [item, setItem] = useState<TComicCharacter>();

  useEffect(() => {
    async function fetchItem() {
      setLoadingItem(true);
      try {
        const apiFetch = isComics ? Api.fetchComicById : Api.fetchCharacterById;
        const {
          data: {
            data: { results },
          },
        } = await apiFetch(itemId);

        setItem(results[0]);
      } catch (error) {
        addToast(error.message, { appearance: 'error' });
      } finally {
        setLoadingItem(false);
      }
    }

    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loadingItem && <BarLoader width="100%" height={4} color="#ef4f21" />}
      <Container>
        <div className="item-details__header">
          <Link to={`/${itemType}`}>
            <AiOutlineArrowLeft style={{ margin: '0 3px -3px 0' }} /> To Back
          </Link>
          <PageHeader title={(item || {})[isComics ? 'title' : 'name']!} />
        </div>
        {!loadingItem && (
          <GridSystemContainer>
            <Row>
              <Col xl={4} lg={6} sm={12}>
                <img
                  className="item-details__img"
                  src={`${item?.thumbnail.path}/portrait_uncanny.${item?.thumbnail.extension}`}
                  alt={`${item?.title}`}
                />
              </Col>
              <Col xl={8} lg={6} sm={12}>
                {isComics ? (
                  <ComicDetails comic={item} />
                ) : (
                  <CharacterDetails character={item} />
                )}
              </Col>
            </Row>
          </GridSystemContainer>
        )}
      </Container>
    </>
  );
}
