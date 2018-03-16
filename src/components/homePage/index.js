import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import styles from './index.less';

@inject('clientStore')
@observer
export default class HomePage extends Component {
  getInfo = () => {
    this.props.clientStore.getInfo();
  };
  render() {
    const { clientStore } = this.props;
    return (
      <div className={styles.wrap}>
        <h2>New Page</h2>
        <h4>{clientStore.title}: {clientStore.info}</h4>
        <button onClick={this.getInfo}>获取Store信息</button>
      </div>
    );
  }
}