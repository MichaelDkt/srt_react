import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './views/loginview';
import Home from './views/home';
import PickingList from './views/pickingList';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
            <Route exact path="/" component={Login}/>
            <Route exact path="/:store/pickingList" component={PickingList}/>
            <Route path="/:store/home" render={(routerProps) => <Home {...routerProps}/>}/>

        </div>
      </Router>
    );
  }
}

export default App;
