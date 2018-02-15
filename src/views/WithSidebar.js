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
            <h2 className="text-center srt">Store Reserve</h2>

            <div className="row">
              <div className="col">
                <img src={this.props.newState.avatar} id="photo_avatar" className="rounded-circle mx-auto" alt={this.props.newState.givenName}/>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <h5 className="text-center givenName">{this.props.newState.givenName}</h5>
              </div>
            </div>
            <div className="row">
              <div className="col text-center">
                <GoogleLogout
                  buttonText="Logout"
                  className= "btn btn-light justify-center logOut"
                  onLogoutSuccess={this.props.logOut}
                >
                </GoogleLogout>
              </div>
            </div>

            <br/>
            <hr/>
            <ul>
              <li>
                {/* <Link to="/1916/home">Home</Link> */}
                {/* <Link to={`${this.props.match.params.store}/home`}>Home</Link> */}
                <Link className="menu" to={`/${localStorage.getItem("store_number")}/home`}>Item location</Link>
              </li>
              <li>
                {/* <Link to="/1916/PickingList">My picking list</Link> */}
                <Link className="menu" to={`/${localStorage.getItem("store_number")}/PickingList`}>Picking list</Link>
              </li>
              <li>
                <Link to={`/${localStorage.getItem("store_number")}/report`}>Report</Link>
              </li>
              <li>
                <Link to={"/changeStore"}>Change store</Link>
              </li>
            </ul>
          </div>
          <div className = "container-fluid">
            <div className= "toggle-btn hamburger" onClick={this.toggleSidebar}>
              <div className="row">
                <div className="col-5">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="col-7" style ={{textAlign: "right", display: "flex", justifyContent: "flex-end"}} >
                  {this.state.showNav3
                    ? null
                    : <div className="logo_decat" style ={{textAlign: "right", display: "flex", justifyContent: "flex-end"}} />
                  }
                </div>
              </div>
            </div>
            {this.props.children}
          </div>
        </div>
    )
  }
}

export default WithSidebar;
