import React, { Component } from 'react';
import { observer } from 'mobx-react';
import NextPageCom from 'components/nextPage';

@observer
export default class NextPage extends Component {

  render() {
    return (
      <div>
        <NextPageCom />
      </div>
    );
  }
}
