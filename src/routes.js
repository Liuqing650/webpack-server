import {
  App,
  HomePage,
  NextPage
} from 'containers';

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: HomePage
      },
      {
        path: '/new',
        component: NextPage
      }
    ]
  }
];
