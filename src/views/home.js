import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../index.css';

class Home extends Component {

  render(){
      return(
        <div>
          <div className = "container">
          <h1>Home page</h1>
            <div class="search-box">
              <input value="Search" type="text" class="form-control" placeholder = "Search your code"/>
              <i class="glyphicon glyphicon-search"></i>
            </div>
          </div>
        </div>
      );
  }
}


export default Home;
