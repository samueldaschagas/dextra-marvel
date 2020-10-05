import React from 'react';
import logoDextraFooter from '../../images/logo-dextra-footer.png';
import './Footer.scss';

export function Footer() {
  return (
    <footer className="footer">
      <a href="https://dextra.com.br" target="_blank" rel="noopener noreferrer">
        <img src={logoDextraFooter} alt="Logo Dextra Rodapé" />
      </a>
    </footer>
  );
}
