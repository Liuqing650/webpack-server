import ClientStore from './client';

export const serverStore = () => ({
  clientStore: new ClientStore()
});
export const clientStore = () => ({
  clientStore: new ClientStore()
});
