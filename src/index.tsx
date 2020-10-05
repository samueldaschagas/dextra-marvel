import React from 'react';
import ReactDOM from 'react-dom';
import { ToastProvider } from 'react-toast-notifications';
import App from './App';
import './index.scss';
import * as serviceWorker from './serviceWorker';

/**
 * Renderiza App em div com id 'root', 
 * utilizando ToastProvider para permitir o uso de notificações nos componentes.
 */
ReactDOM.render(
  <React.StrictMode>
    <ToastProvider placement="bottom-right" autoDismiss>
      <App />
    </ToastProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
