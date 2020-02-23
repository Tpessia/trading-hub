import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AppLayout from './modules/layout/AppLayout';
import Simulator from './modules/trading/scenes/Simulator';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route path="/">
            <AppLayout>
              <Switch>
                <Route path="/" exact>
                  <Simulator />
                </Route>
              </Switch>
            </AppLayout>
          </Route>
        </Router>
      </div>
    );
  }
}
