import Loadable from 'react-loadable';
import LoadingCom from 'components/common/LoadingCom';

const loadable = (Component) => {
  return Loadable({
    loader: Component,
    loading: LoadingCom,

  });
};
export default loadable;
