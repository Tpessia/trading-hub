import { message } from 'antd';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './modules/home/scenes/Home';
import AppLayout from './modules/layout/components/AppLayout';
import Simulator from './modules/trading/scenes/Simulator';

export default class App extends React.Component {
  componentDidMount() {
    message.config({
      // top: 45,
      duration: 3,
      maxCount: 3
    })
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Route path="/">
            <AppLayout>
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/simulator" exact>
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
