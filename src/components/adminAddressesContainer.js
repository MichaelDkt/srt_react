import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';


import WithSidebar from '../views/WithSidebar';
import '../index.css';

const serverUrl = process.env.REACT_APP_SERVERURL;

class AdminAddressesContainer extends Component {

  constructor(props){
    super(props);
    this.state = {
      addressesList : [],
      filteredList : [],
      lettersList : [],
      loading : true,
      addressToCreate : "",
      error : "",
      freeRate : 0
    }
    this.filterList = this.filterList.bind(this);
    this.handleAddressToCreate = this.handleAddressToCreate.bind(this);
  }

  handleAddressToCreate = (event) => {
    this.setState({
      ...this.state,
      addressToCreate: event.target.value
    })
  }


  // -----------------------------------------
  // retrieve the addresses list of this store
  // -----------------------------------------
  componentDidMount(){

    return fetch(`${serverUrl}/${this.props.match.params.store}/addresses`)
    .then(response => response.json())
    .then(result => {

      this.calculateFreeRate(result);

      this.setState({
        addressesList : result,
        // filteredList : result.filter(address => address.disabled === false),
        filteredList : result,
        loading : false
      });
      this.setState({
        ...this.state,
        lettersList : this.buildUniqueLettersList()
      });

    })
    .catch(error => {
        console.log(error);
    });

  }

  buildUniqueLettersList(){
    const arrayLetters = this.state.addressesList.map(address => address.address.substring(0,1));
    return Array.from(new Set(arrayLetters));
  }

  // ---------------------------------------
  // calculate the free rate of this reserve
  // ---------------------------------------
  calculateFreeRate(addresses){

    let addresses_free = 0;
    for (let i = 0; i<addresses.length; i++){
      if (addresses[i].qty_ref === "0" && !addresses[i].disabled){
        addresses_free = addresses_free + 1;
      }
    }

    this.setState ({
      ...this.state,
      freeRate : Math.round( 100*addresses_free/addresses.length )
    });
  }
  // -------------------------------------------------------
  // filter the array with or without the disabled addresses
  // -------------------------------------------------------
  filterList(event){
    let newList = [];
    if (event.target.checked){
      newList = this.state.addressesList;
      // newList = this.state.filteredList;
    } else {
      newList = this.state.addressesList.filter(address => address.disabled === false);
      // newList = this.state.filteredList.filter(address => address.disabled === false);
    }
    this.setState ({
      ...this.state,
      filteredList : newList
    });
  }

  // --------------------------
  // filter the array by letter
  // --------------------------
  filterListByLetter(letter){
    let newList = [];
    if (letter === "removeFilter"){
      newList = this.state.addressesList;
    } else {
      newList = this.state.addressesList.filter(address => address.address.substring(0,1) === letter);
    }

    this.setState ({
      ...this.state,
      filteredList : newList
    });
  }

  // ------------------
  // disable an address
  // ------------------
  disableAddress(id, targetState){
    this.setState ({
      ...this.state,
      loading : true
    });

    return fetch(`${serverUrl}/${this.props.match.params.store}/addresses/${id}`,{
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "disabled" : targetState }),
      method: "PATCH"
    })
    .then(response => response.json())
    .then(result => {
      this.componentDidMount();
    })
    .catch(error => {
        console.log(error);
    });
  }

  // -----------------
  // create an address
  // -----------------
  createAddress(addressToCreate){
    this.setState ({
      ...this.state,
      loading : true
    });

    return fetch(`${serverUrl}/${this.props.match.params.store}/addresses/${addressToCreate}`,{
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    })
    .then(response => response.json())
    .then(result => {
      if (result.code === "201"){
        //this.componentDidMount();
        window.location.reload();
      } else {
        this.setState ({
          ...this.state,
          error : result.text,
          loading : false
        });
      }
    })
    .catch(error => {
        console.log(error);
    });
  }

  drawChart(){
    const data = {
    	labels: [
    		'At least one item % ',
    		'Empty % '
    	],
    	datasets: [{
    		data: [100 - this.state.freeRate, this.state.freeRate],
    		backgroundColor: [
    		'#ff4d4d',
    		'#00cc00'
    		],
    		hoverBackgroundColor: [
    		'#ff8080',
    		'#1aff1a'
    		]
    	}]
    };
    return(
      <div className="pie">
        <Pie data={data}
            width={120}
          	height={60}
            legend={null}
          	options={{
          		maintainAspectRatio: false
          	}}
          />
      </div>
    )
  }


  render(){
    return(

      <WithSidebar newState={this.props.newState} logOut={this.props.logOut}>
        <div className = "jumbotron container">
        <div style={{position:"relative"}}>{ this.state.loading ? <i className="fa fa-hourglass-start fa-2x" style={{position:"absolute",top:"10px",right:"10px"}}></i> : null}
        <h2 className="text-center">Admin addresses</h2>
          {this.drawChart()}
        <h6 className="text-center"><em>Availability : {this.state.freeRate} %</em></h6>

        <nav className="navbar navbar-light bg-light">

          {/*
          <label>
             disabled :
            <input name="disabled" type="checkbox"  onChange={event => this.filterList(event)} />
          </label>
          */}
          <button type="button" className="btn blueButton btn-sm" data-toggle="modal" data-target="#exampleModal">New</button>
          <button type="button" className="btn aisleLetter btn-sm" onClick={ event => this.filterListByLetter("removeFilter") }>All</button>
          { this.state.lettersList.map( (letter) => this.insertLetter(letter))}
        </nav>

        <table className="table table-hover text-center">
          <thead>
            <tr><th>Addresses</th><th>Busy</th><th>Actions</th></tr>
          </thead>
          <tbody>
            { this.state.filteredList.map( (address) => this.insertRow(address) ) }
          </tbody>
        </table>


        <div  className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModal" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalPickTitle">Create address</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">Enter your address</span>
                  </div>
                  <input type="text" className="form-control" onChange={this.handleAddressToCreate} />
                </div>
                <div><span id="error">{ this.state.error }</span></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-dismiss="modal"> Cancel </button>
                <button type="button" className="btn btn-success" onClick={() => this.createAddress(this.state.addressToCreate)} >Create</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
</WithSidebar>

    )
  }

  insertRow(address){
    return (

      <tr key={address.id}>
        <td>{ address.address }</td>
        <td>{ address.stock_total !== "0" ? <i className="fa fa-check"></i> : null }</td>
        <td>
          {address.qty_ref === "0" && !address.disabled ?
          <button className="btn btn-sm btn-danger" title="delete this address" onClick={event => this.disableAddress(address.id, true)}><i className="fa fa-trash"></i></button>
          : null }
          { address.disabled ?
          <button className="btn btn-sm btn-warning" title="restore this address" onClick={event => this.disableAddress(address.id, false)}><i className="fa fa-repeat"></i></button>
          : null }
        </td>
      </tr>


    )
  }

  insertLetter(letter){
    return(
      <button key={letter} type="button" className="btn aisleLetter btn-sm" onClick={ event => this.filterListByLetter(letter) }>{letter}</button>
    )
  }
}


export default AdminAddressesContainer;
