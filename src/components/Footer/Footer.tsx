import React from 'react';
import logoDextraFooter from '../../images/logo-dextra-footer.png';
import './Footer.scss';

export function Footer() {
  return (
    <div data-testid="footer">
      <hr />
      <footer className="footer">
        <a
          href="https://dextra.com.br"
          data-testid="dextra-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logoDextraFooter} alt="Logo Dextra Rodapé" />
        </a>
      </footer>
    </div>
  );
}
