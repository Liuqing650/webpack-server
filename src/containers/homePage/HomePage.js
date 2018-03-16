import React, { Component } from 'react';
import { observer } from 'mobx-react';
import HomePageCom from 'components/homePage';

@observer
export default class HomePage extends Component {

  render() {
    return (
      <div>
        <HomePageCom />
      </div>
    );
  }
}
