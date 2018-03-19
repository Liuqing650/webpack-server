import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import {
  App,
  HomePage,
  NextPage
} from 'containers';

export default (allStores) => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="new" component={NextPage} />
      <Redirect from="*" to="/" />
    </Route>
  );
};
