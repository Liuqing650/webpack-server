import { observable, action, extendObservable } from 'mobx';

class ClientStore {
  @observable title = 'hello mobx';
  @observable info = 'nothing';
  @observable env = '';

  constructor(initialState) {
    // 服务端初始化数据
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
