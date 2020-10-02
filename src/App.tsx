import React, { CSSProperties } from 'react';
import { BrowserRouter as Router, NavLink, Redirect, Route, Switch } from "react-router-dom";
import './App.scss';
import ComicPage from './components/comic-page';
import Comics from './components/comics';

function App() {
  const activeStyle: CSSProperties = {
    color: "#ef4f21"
  };
  
  return (
    <Router>
      <div className="App">
        <header>
          <nav className="header__nav">
            <span className="header__nav__brand">
              <NavLink activeStyle={activeStyle} to="/comics">
                <img src="./images/logo.svg" alt="Logo Marvel" />
              </NavLink>
            </span>
            <ul>
              <li>
                <NavLink activeStyle={activeStyle} to="/comics">Comics</NavLink>
              </li>
              <li>
                <NavLink activeStyle={activeStyle} to="/characters">Characters</NavLink>
              </li>
            </ul>
            <span className="header__nav__dextra-link">
              <a href="https://dextra.com.br" target="_blank" rel="noopener noreferrer">
                <img src="./images/logo-dextra-branca.png" alt="Logo Dextra" />
              </a>
            </span>
          </nav>
        </header>

        <Redirect exact from='/' to='/comics' />
        <Switch>
          <Route 
            exact 
            path="/comics" 
            render={(props) => <Comics {...props} title="Comics" /> } 
          />
          <Route exact path="/comics/:comicId" component={ComicPage} />
          <Route 
            exact 
            path="/characters" 
            render={(props) => <Comics {...props} title="Characters" /> } 
          />
          {/* <Route exact path="/characters">
            <div className="header__img-wrapper">
              <img 
                src="./images/characters-banner.jpg" 
                className="header__img-banner" 
                alt="Banner Personagens" 
              />
            </div>
          </Route> */}
        </Switch>

        <footer className="App__footer">
          <a href="https://dextra.com.br" target="_blank" rel="noopener noreferrer">
            <img src="./images/logo-dextra-preta.png" alt="Logo Dextra Rodapé" />
          </a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
