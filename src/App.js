/* global gapi */
import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './views/login';
import Home from './views/home';
import PickingList from './views/pickingList';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import AdminAddressesContainer from './components/adminAddressesContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      fullname: null,
      givenName: null,
      familyName: null,
      avatar: null,
      email: null,
      id_token: null,
      isLoggedIn:undefined
    }
  }

  responseGoogle = (googleUser) => {

    const profile = googleUser.getBasicProfile();
    this.setState({
      id: profile.getId(),
      fullname: profile.getName(),
      givenName: profile.getGivenName(),
      familyName: profile.getFamilyName(),
      avatar: profile.getImageUrl(),
      email: profile.getEmail(),
      id_token: googleUser.getAuthResponse().id_token,
      isLoggedIn: true
    });
    //The ID token you'd need to pass to your backend:
    return this.state.id_token;
  }


  logOut = () => {
    this.setState({
      id: null,
      fullname: null,
      givenName: null,
      familyName: null,
      avatar: null,
      email: null,
      id_token: null,
      isLoggedIn:false
    });
  }

  render() {
    return (
      <Router>
        <div>
            <Route exact path="/" render= {(routerProps) => <Login newState= { this.state }  responseGoogle = {this.responseGoogle} {...routerProps}/>}/>
            <Route exact path="/:store/pickingList" component={PickingList}/>
            <Route path="/:store/home" render={(routerProps) => (
              this.state.isLoggedIn === true
                ? <Home newState= { this.state } logOut = {this.logOut}  {...routerProps}/>
                : this.state.isLoggedIn === false
                  ? <Redirect to="/" />
                :  <div className="fa fa-spinner" style={{fontSize:"24px"}}>
                <GoogleLogin
                    clientId= {process.env.REACT_APP_GOOGLECLIENTID}
                    onSuccess={this.responseGoogle}
                    onFailure={this.logOut}
                    isSignedIn={true}
                    style={{visibility: "hidden"}}
                ></GoogleLogin>
              </div>
            )
            }/>
            <Route exact path="/:store/adminAdresses" component={AdminAddressesContainer}/>
        </div>
      </Router>
    );
  }
}

export default App;
