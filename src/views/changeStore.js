import React, { Component } from 'react';
import '../index.css';

const serverUrl = process.env.REACT_APP_SERVERURL;

class ChangeStore extends Component {

  constructor(props){
    super(props);
    this.state = {
      storesList : [],
      loading : true
    }
    this.chooseStore = this.chooseStore.bind(this);
  }

  // ---------------------------
  // retrieve the list of stores
  // ---------------------------
  componentDidMount(){

    return fetch(`${serverUrl}/stores`)
    .then(response => response.json())
    .then(result => {
      this.setState({
        storesList : result,
        loading : false
      });
      // console.log(this.state.storesList);
    })
    .catch(error => {
        console.log(error);
    });

  }

  // -----------------------------
  // insert a backroom in the list
  // -----------------------------
  insertRow(store){
    return (
      <tr key={store.id}>
        <td className="to-center">{store.store_number}</td>
        <td className="to-center">{store.description}</td>
        <td className="to-center">{store.country_code}</td>
        <td>{
          store.id === localStorage.getItem("store_number")
          ?
          "connected"
          :
          <button className="btn btn-success btn-sm" onClick={ () => this.chooseStore(store.id, store.store_number)}>OK</button>
        }
        </td>
      </tr>
    )
  }

  // -------------------------------------
  // change the store in the local storage
  // and redirect to home
  // -------------------------------------
  chooseStore(id, store_number){
    localStorage.setItem("store_number", store_number);
    localStorage.setItem("reserve_id", id);

    // console.log(localStorage.getItem("store_number"));
    // console.log(localStorage.getItem("reserve_id"));

    this.props.history.push(`/${store_number}/home`);
  }

  render(){
    return(
      <div className = "jumbotron container" style={{position:"relative"}}>
        <h2 className="text-center">Choose store</h2>{ this.state.loading ? <i className="fa fa-hourglass-start fa-2x" style={{position:"absolute",top:"10px",right:"10px"}}></i> : null}

        <table className="table table-hover text-center">
          <thead>
            <tr><th>Store</th><th>Description</th><th>Country</th><th></th></tr>
          </thead>
          <tbody>
            { this.state.storesList.map( (store) => this.insertRow(store) ) }
          </tbody>
        </table>

      </div>

    );
  }
}


export default ChangeStore;
