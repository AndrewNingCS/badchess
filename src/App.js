import React from 'react';
import Home from './Home';
import { Switch, Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/create"/>
        <Route path="/join"/>
        <Route path="/singleplayer"/>
      </Switch>
    </Router>
  );
}

export default App;
