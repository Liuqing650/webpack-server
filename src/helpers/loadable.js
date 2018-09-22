import React from 'react';
import Loadable from 'react-loadable';
import LoadingCom from 'components/common/LoadingCom';

const loadable = (component) => {
  return Loadable({
    loader: component,
    loading() {
      return <LoadingCom />;
    },

  });
};
export default loadable;
