
import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './views/login';
import Home from './views/home';
import PickingList from './views/pickingList';
import ChangeStore from './views/changeStore';
import Report from './views/report';
import { GoogleLogin } from 'react-google-login';
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
      isLoggedIn:localStorage.getItem("isLoggedIn") ? undefined : false
    }
  }

  responseGoogle = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    localStorage.setItem("isLoggedIn", "logged");
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
    localStorage.removeItem("isLoggedIn");
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
            <Route exact path="/:store/pickingList" render= {(routerProps) =>
              <NeedsToBeLoggedIn isLoggedIn={this.state.isLoggedIn} onSuccess={this.responseGoogle} onFailure={this.logOut} >
                <PickingList newState= { this.state } logOut = {this.logOut} {...routerProps}/>
              </NeedsToBeLoggedIn>
            }/>
            <Route path="/:store/home" render={(routerProps) =>
              <NeedsToBeLoggedIn isLoggedIn={this.state.isLoggedIn} onSuccess={this.responseGoogle} onFailure={this.logOut} >
                <Home newState= { this.state } logOut = {this.logOut}  {...routerProps}/>
              </NeedsToBeLoggedIn>
            }/>
            <Route exact path="/:store/admin" render= {(routerProps) =>
              <NeedsToBeLoggedIn isLoggedIn={this.state.isLoggedIn} onSuccess={this.responseGoogle} onFailure={this.logOut} >
                <AdminAddressesContainer newState= { this.state } logOut = {this.logOut} {...routerProps}/>
              </NeedsToBeLoggedIn>
            }/>
            <Route exact path="/changeStore" render={(routerProps) =>
              <NeedsToBeLoggedIn isLoggedIn={this.state.isLoggedIn} onSuccess={this.responseGoogle} onFailure={this.logOut}  >
              <ChangeStore {...routerProps}/>
              </NeedsToBeLoggedIn>
            }/>
            <Route exact path="/:store/report" render={(routerProps) =>
              <NeedsToBeLoggedIn isLoggedIn={this.state.isLoggedIn} onSuccess={this.responseGoogle} onFailure={this.logOut}  >
                <Report newState= { this.state } logOut = {this.logOut} {...routerProps}/>
              </NeedsToBeLoggedIn>
            }/>
        </div>
      </Router>
    );
  }
}

function NeedsToBeLoggedIn(props) {
  return props.isLoggedIn === true
    ? props.children
    : props.isLoggedIn === false
      ? <Redirect to="/" />
      : <div className="fa fa-spinner" style={{fontSize:"24px"}}>
          <GoogleLogin
              clientId= {process.env.REACT_APP_GOOGLECLIENTID}
              onSuccess={props.onSuccess}
              onFailure={props.Failure}
              isSignedIn={true}
              style={{visibility: "hidden"}}
          ></GoogleLogin>
        </div>
}

export default App;
