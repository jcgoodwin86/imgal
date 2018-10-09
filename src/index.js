import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Work Sans:300,500,600', 'sans-serif'],
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
