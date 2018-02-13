import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
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
            <a style = {{marginRight:"24px"}}> Welcome {this.props.newState.givenName}</a>
            <br/>
            <ul>
              <li>Home</li>
              <li>My picking list</li>
              <li>admin</li>
            </ul>
            <GoogleLogout
              buttonText="Logout"
              className= "btn btn-outline-primary"
              onLogoutSuccess={this.props.logOut}
            >
            </GoogleLogout>
          </div>
          <div className = "content">
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
