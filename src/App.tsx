import { Footer, Header } from 'components';
import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { ItemDetails, Items } from './pages';

/**
 * Componente responsável pela exibição do layout principal e por fazer mapeamentos das rotas.
 */
function App() {
  return (
    <Router>
      <Header />
      <main>
        <Switch>
          <Redirect exact from="/" to="/comics" />
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
            path={['/comics/:itemId', '/characters/:itemId']}
            component={ItemDetails}
          />
        </Switch>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
