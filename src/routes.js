import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import {
  App,
  HomePage
} from 'containers';

export default (allStores) => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Redirect from="*" to="/" />
    </Route>
  );
};
