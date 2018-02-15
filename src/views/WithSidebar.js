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
            <h2 className="text-center">S.R.T.</h2>

            <div className="row">
              <div className="col">
                <img src={this.props.newState.avatar} id="photo_avatar" className="rounded-circle mx-auto" alt={this.props.newState.givenName}/>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <h5 className="text-center">{this.props.newState.givenName}</h5>
              </div>
            </div>

            <br/>
            <hr/>
            <ul>
              <li>
                {/* <Link to="/1916/home">Home</Link> */}
                {/* <Link to={`${this.props.match.params.store}/home`}>Home</Link> */}
                <Link to={`/${localStorage.getItem("store_number")}/home`}>Home</Link>
              </li>
              <li>
                {/* <Link to="/1916/PickingList">My picking list</Link> */}
                <Link to={`/${localStorage.getItem("store_number")}/PickingList`}>My picking list</Link>
              </li>
              <li>
                <Link to={"/changeStore"}>Change store</Link>
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
