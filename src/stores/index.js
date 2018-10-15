
import { toJS } from 'mobx';
import clientStore, { ClientStoreClass } from './client';
import homeStore, { HomeStoreClass } from './home';

export const serverCreateStore = () => {
  console.log('clientStore------->', toJS(clientStore));
  return {
    clientStore: new ClientStoreClass(),
    homeStore: new HomeStoreClass(),
  }
};
export const clientCreateStore = () => ({
  clientStore,
  homeStore,
});
