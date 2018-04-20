import { observable, action } from 'mobx';

class ClientStore {
  @observable title = 'hello mobx';
  @observable info = 'nothing';

  @action.bound getInfo() {
    this.info = 'success!';
  }
}
export default ClientStore;
