import { observable, action, extendObservable } from 'mobx';

class ClientStore {
  @observable title = 'hello mobx';
  @observable info = 'nothing1';
  @observable env = '';

  constructor(initialState) {
    if (initialState) {
      console.log('initialState----->', initialState);
      extendObservable(this, initialState.clientStore);
    }
  }

  @action.bound getInfo() {
    this.info = 'success!';
  }
}

export const ClientStoreClass = ClientStore;
export default new ClientStore(__SERVER__ ? null : window.__INITIAL_STATE__);
