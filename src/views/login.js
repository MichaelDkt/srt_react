import React, { Component} from 'react';
import { Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Home from './home';

class Login extends Component {

responseGoogle = (googleUser) => {
console.log(googleUser);
// window.googleConnectCallback = function(googleUser) {
  // Useful data for your client-side scripts:
  const profile = googleUser.getBasicProfile();
  console.log(profile);
  console.log(profile.getName());
  this.setState({
    this.props.id = { profile.getId() }, // Don't send this directly to your server!
    this.props.fullname = { profile.getName() },
    this.props.givenName= {profile.getGivenName()},
    this.props.familyName= {profile.getFamilyName()},
    this.props.avatar= {profile.getImageUrl()},
    this.props.email= {profile.getEmail()},
    this.props.id_token= {googleUser.getAuthResponse().id_token}
  });
  // The ID token you'd need to pass to your backend:
  return this.state.id_token;
}

logout = () => {
  console.log("logout");
}

  render() {
    return(
      <div>
        <h1>Login page</h1>
        <div className="container">
          <div className = "row">
          { this.state.id_token ? (
            <div className="signout btn btn-danger" onClick={this.logout}>
            this.state.isLoggedIn ? (
              <Home givenName = { this.props.givenName } />
            ):(
              <div>Login Please</div>
            )
            </div>
          ) :
          (<GoogleLogin
            clientId="1047400810357-8q51rek0hqgdc1hnavlqadr0u2behi4k.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
          />
          )
          }
          </div>
        </div>
      </div>
    );
  }
}



export default Login;
