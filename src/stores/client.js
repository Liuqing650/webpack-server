import { observable, action, extendObservable } from 'mobx';

class ClientStore {
  @observable title = 'hello mobx';
  @observable info = 'nothing';
  @observable routing = {};

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.clientStore);
    }
  }

  @action.bound getInfo() {
    this.info = 'success!';
  }
}

export const ClientStoreClass = ClientStore;
export default new ClientStore(__SERVER__ ? null : window.__INITIAL_STATE__);
