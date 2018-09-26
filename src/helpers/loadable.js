import Loadable from 'react-loadable';
import LoadingCom from 'components/common/LoadingCom';

export default cmp => {
  return Loadable({
    loader: cmp,
    loading: LoadingCom,
  });
};
