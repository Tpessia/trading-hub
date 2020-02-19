import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import './App.css';
import Trading from './modules/trading/scenes/Trading';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/">
              <Trading />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
