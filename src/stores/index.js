
import { toJS } from 'mobx';
import clientStore, { ClientStoreClass } from './client';

export const serverCreateStore = () => {
  console.log('clientStore------->', toJS(clientStore));
  return {
    clientStore: new ClientStoreClass()
  }
};
export const clientCreateStore = () => ({
  clientStore
});
