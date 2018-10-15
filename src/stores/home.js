import { observable, action, extendObservable } from 'mobx';

class HomeStore {
  @observable home = 'hello home';

  constructor(initialState) {
    // 服务端初始化数据
    if (initialState) {
      extendObservable(this, initialState.homeStore);
    }
  }

  @action.bound getInfo() {
    this.info = 'success!';
  }
}

export const HomeStoreClass = HomeStore;
export default new HomeStore(__SERVER__ ? null : window.__INITIAL_STATE__);
