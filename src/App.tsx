import React, { CSSProperties } from 'react';
import { useScreenClass } from 'react-grid-system';
import {
  BrowserRouter as Router,
  NavLink,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import './App.scss';
import logoDextraFooter from './images/logo-dextra-footer.png';
import logoDextra from './images/logo-dextra.png';
import logoMarvelMobile from './images/logo-marvel-mobile.png';
import logoMarvel from './images/logo-marvel.svg';
import { ItemDetails, Items } from './pages';

function App() {
  const screenClass = useScreenClass();
  const isMobile = ['xs', 'sm'].includes(screenClass);
  const activeStyle: CSSProperties = {
    color: '#ef4f21',
  };

  return (
    <Router>
      <div className="App">
        <header>
          <nav className="header__nav">
            <span className="header__nav__brand">
              <NavLink activeStyle={activeStyle} to="/comics">
                <img
                  src={isMobile ? logoMarvelMobile : logoMarvel}
                  alt="Logo Marvel"
                />
              </NavLink>
            </span>
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
            <span className="header__nav__dextra-link">
              <a
                href="https://dextra.com.br"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logoDextra} alt="Logo Dextra" />
              </a>
            </span>
          </nav>
        </header>

        <Redirect exact from="/" to="/comics" />
        <Switch>
          <Route
            exact
            path="/comics"
            render={(props) => <Items {...props} title="Comics" />}
          />
          <Route
            exact
            path="/characters"
            render={(props) => <Items {...props} title="Characters" />}
          />
          <Route
            exact
            path={['/comics/:comicId', '/characters/:comicId']}
            component={ItemDetails}
          />
        </Switch>

        <footer className="App__footer">
          <a
            href="https://dextra.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logoDextraFooter} alt="Logo Dextra Rodapé" />
          </a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
