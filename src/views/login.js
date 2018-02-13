import React, { Component} from 'react';
import { Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

class Login extends Component {

  render() {
    return(
      <div>
        <div className="container" >
          <h3 className="text-center" style ={{marginTop: "10vh"}}> Welcome to Store Backroom  </h3>
          <br/>
              <div className = "row d-flex justify-content-center " style ={{marginTop: "15vh"}}>
              { this.props.newState.isLoggedIn ? (
                  <Redirect to={`/${this.props.match.params.store}/home`}/>
              ) : (
                <GoogleLogin
                cclientId= {process.env.REACT_APP_GOOGLECLIENTID}
                buttonText="Login with Google"
                className= "btn btn-outline-primary"
                onSuccess={this.props.responseGoogle}
                onFailure={this.props.logOut}
                isSignedIn={true}
              />
              )}
              </div>
        </div>
      </div>
    );
  }
}



export default Login;
