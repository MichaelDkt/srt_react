import React, { Component } from 'react';
import { GoogleLogout } from 'react-google-login';
import { Link } from 'react-router-dom';
import '../index.css';


class WithSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNav3:false
    }
  }

  toggleSidebar = () => {
    this.setState({
          showNav3:!this.state.showNav3
    })
  }

  render() {
    return (
        <div className= "container-fluid contentContainer">
          <div className= {this.state.showNav3 ? "sidebar active" : "sidebar"  }>
          <br/>
            <a>
            Welcome {this.props.newState.givenName}
            <img src={this.props.newState.avatar} className="rounded-circle" alt={this.props.newState.givenName}/>
            </a>
            <br/>
            <hr/>
            <ul>
              <li>
              <Link to="/1916/home">Home</Link>
              </li>
              <li>
               <Link to="/1916/PickingList">My picking list</Link>
              </li>
            </ul>
            <GoogleLogout
              buttonText="Logout"
              className= "btn btn-outline-primary"
              onLogoutSuccess={this.props.logOut}
            >
            </GoogleLogout>
          </div>
          <div className = "container-fluid">
            <div className= "toggle-btn" onClick={this.toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            {this.props.children}
          </div>
        </div>
    )
  }
}

export default WithSidebar;
