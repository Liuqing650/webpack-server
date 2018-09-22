import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import styles from './index.less';

@inject('clientStore')
@withRouter
@observer
export default class NextPage extends Component {
  static proptypes = {
    clientStore: PropTypes.object,
  }

  getInfo = () => {
    this.props.clientStore.getInfo();
  };
  goBack = () => {
    this.props.history.push('/');
  }
  render() {
    const { clientStore } = this.props;
    return (
      <div className={styles.wrap}>
        <h2>Next Page</h2>
        <h4>{clientStore.title}: {clientStore.info}</h4>
        <button onClick={this.getInfo}>获取Store信息</button>
        <button onClick={this.goBack}>返回</button>
      </div>
    );
  }
}