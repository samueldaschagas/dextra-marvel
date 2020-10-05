import { Container } from 'components';
import React, { CSSProperties } from 'react';
import { useScreenClass } from 'react-grid-system';
import { NavLink } from 'react-router-dom';
import logoDextra from '../../images/logo-dextra.png';
import logoMarvelMobile from '../../images/logo-marvel-mobile.png';
import logoMarvel from '../../images/logo-marvel.svg';
import './Header.scss';

const activeStyle: CSSProperties = {
  color: '#ef4f21',
};

export function Header() {
  // Utiliza hook useScreenClass para verificar resolução atual da tela
  const screenClass = useScreenClass();

  // Verifica se resolução atual é menor que 768px (sm) ou se é igual ou menor que 576px (xs)    
  const isMobile = ['xs', 'sm'].includes(screenClass);

  return (
    <header className="header">
      <Container removePadding>
        <nav className="header__nav">
          <NavLink
            activeStyle={activeStyle}
            to="/comics"
            className="header__marvel-link"
          >
            <img
              // Verifica qual logo deve ser exibida de acordo com resolução da tela
              src={isMobile ? logoMarvelMobile : logoMarvel}
              alt="Logo Marvel"
            />
          </NavLink>
          <ul>
            <li>
              <NavLink activeStyle={activeStyle} to="/comics">
                Comics
              </NavLink>
            </li>
            <li>
              <NavLink activeStyle={activeStyle} to="/characters">
                Characters
              </NavLink>
            </li>
          </ul>
          <a
            className="header__dextra-link"
            href="https://dextra.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logoDextra} alt="Logo Dextra" />
          </a>
        </nav>
      </Container>
    </header>
  );
}
