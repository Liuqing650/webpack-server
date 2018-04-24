import React from 'react';
// import { Route } from 'react-router';
import { Route, IndexRoute, Redirect } from 'react-router';
// import createBrowserHistory from 'history/lib/createBrowserHistory';
import {
  App,
  HomePage,
  NextPage
} from 'containers';

// export default [
//   {
//     component: App,
//     routes: [
//       {
//         path: '/',
//         exact: true,
//         component: HomePage
//       },
//       {
//         path: '/new',
//         component: NextPage
//       }
//     ]
//   }
// ];
// const history = createBrowserHistory();
// const routes = (
//   <Route path="/" component={App} history={history} >
//     <Route path="home" component={HomePage} />
//     <Route path="new" component={NextPage} />
//   </Route>
// );

// export default routes;


export default (allStores) => {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="home" component={HomePage} />
      <Route path="new" component={NextPage} />
      <Redirect from="*" to="/" />
    </Route>
  );
};
