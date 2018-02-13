import React, { Component } from 'react';
import '../index.css';

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

    return fetch(`/stores`)
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
        <td>{store.store_number}</td>
        <td>{store.description}</td>
        <td>{store.country_code}</td>
        <td>{
          store.id === localStorage.getItem("store_number")
          ?
          "connected"
          :
          <button className="btn btn-success btn-sm" onClick={ () => this.chooseStore(store.id, store.store_number)}>Choose</button>
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
      <div className = "container" style={{position:"relative"}}>
        <h3 className="text-center">Choose the back room you want to enter in</h3>{ this.state.loading ? <i className="fa fa-hourglass-start fa-2x" style={{position:"absolute",top:"10px",right:"10px"}}></i> : null}

        <table className="table table-sm table-bordered">
          <thead className="thead-dark">
            <tr><th>store #</th><th>description</th><th>country</th></tr>
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
