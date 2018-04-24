import clientStore, { ClientStoreClass } from './client';

export const serverStores = () => ({
  clientStore: new ClientStoreClass()
});
export const clientStores = () => ({
  clientStore
});
