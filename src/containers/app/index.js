import React, {Component} from 'react';
import {  Route, Switch, Redirect, withRouter } from 'react-router-dom';
import routers from '../../routes';

class App extends React.Component {
  componentDidMount() {
    console.log(5555)
  }
  render() {
    return (
      <div id="content">
        <Switch>
          {routers.map(item => (
            <Route
              key={item.path}
              path={item.path}
              exact={item.exact || false}
              render={props => {
                if (item.path === '*') {
                  return <Redirect to="/" />;
                }
                return <item.component {...props} routes={item.routes || null} />
              }}
            />
          ))}
        </Switch>
      </div>
    );
  }
}
export default withRouter(App);
