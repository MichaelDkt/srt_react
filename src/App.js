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
            <Route exact path="/home" component={Home}/>
            <Route exact path="/:store/pickingList" component={PickingList}/>
        </div>
      </Router>
    );
  }
}

export default App;

/*
<Router>
  <div>
      <DisplayNavBar />
      <Route exact path="/" component={Login}/>
      <Route path="/login" render={() => <Login/>}/>
      <Route path="/cart" component={Cart}/>
      <Route path="/paymentOK" component={PaymentOK}/>
      <Route path="/category/:category_id" render={(routerProps) => <ProductsList  {...routerProps}/>}/>
      <Route path="/product/:product_id" render={(routerProps) => <ProductDetails  {...routerProps}/>}/>
  </div>
</Router>
*/
