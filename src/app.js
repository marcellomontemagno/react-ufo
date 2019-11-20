import React from 'react';
import ReactDOM from 'react-dom';
import {hot} from 'react-hot-loader/root'
import Root from './Root';

const App = hot(Root)

ReactDOM.render(
  <App/>,
  document.getElementById('root'),
)