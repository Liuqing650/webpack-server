import React from 'react';
import { observer } from 'mobx-react';

@observer
export default class App extends React.Component {
  render() {
    return (
      <div id="content">
        {this.props.children}
      </div>
    );
  }
}
