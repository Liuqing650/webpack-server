import clientStore, { ClientStoreClass } from './client';

export const serverCreateStore = () => ({
  clientStore: new ClientStoreClass()
});
export const clientCreateStore = () => ({
  clientStore
});
