import React from 'react';
import { render } from 'react-dom';
import Example from './components/example';

const App = () => {
  return (
    <div>
      <h2>TEST WEBPACK</h2>
      <Example />
    </div>
  );
};
render(<App />, document.getElementById('root'));
if (module.hot) {
  module.hot.accept();
}