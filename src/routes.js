import loadable from 'helpers/loadable';
import HomePage from 'containers/homePage';

// 按需加载
// const HomePage = loadable(() =>
//   import('./containers/homePage' /* webpackChunkName: 'HomePage' */));

const NextPage = loadable(() =>
  import('./containers/nextPage' /* webpackChunkName: 'NextPage' */));


const routers = [
  {
    path: '/',
    exact: true,
    component: HomePage,
  },
  {
    path: '/next',
    component: NextPage,
  }
];

export default routers;
