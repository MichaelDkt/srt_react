import React, { Component } from 'react';
import WithSidebar from './WithSidebar';
import { Link } from 'react-router-dom';
import '../index.css';

const serverUrl = process.env.REACT_APP_SERVERURL;

class Report extends Component {

  constructor(props){
    super(props);
    this.state = {
      addressesList : [],
      filteredList : [],
      lettersList : [],
      loading : true,
      addressToCreate : "",
      error : ""
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


  // -------------------------------------
  // retrieve the stock list of this store
  // -------------------------------------
  componentDidMount(){

    return fetch(`${serverUrl}/${this.props.match.params.store}/report`)
    .then(response => response.json())
    .then(result => {

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
    //console.log('newlist : ' + newList);
  }

  // --------------------------
  // filter the array by letter
  // --------------------------
  filterListByLetter(letter){
    // console.log(letter);
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
    // console.log('newlist : ' + newList);
  }





  render(){
    return(

      <WithSidebar newState={this.props.newState} logOut={this.props.logOut}>
        <div className = "jumbotron container">
        <div className = "container" style={{position:"relative"}}>{ this.state.loading ? <i className="fa fa-hourglass-start fa-2x" style={{position:"absolute",top:"10px",right:"10px"}}></i> : null}
        <h1 className="text-center">Stock report</h1>



        <nav className="navbar navbar-light bg-light">

          {/*
          <label>
             disabled :
            <input name="disabled" type="checkbox"  onChange={event => this.filterList(event)} />
          </label>
          */}
          <button type="button" className="btn btn-outline-info btn-sm" onClick={ event => this.filterListByLetter("removeFilter") }>(All)</button>
          { this.state.lettersList.map( (letter) => this.insertLetter(letter))}
        </nav>

        <table className="table table-sm table-bordered">
          <thead className="thead-dark">
            <tr><th>Addresses</th><th>Item</th><th>Qty</th></tr>
          </thead>
          <tbody>
            { this.state.filteredList.map( (address, index) => this.insertRow(address,index) ) }
          </tbody>
        </table>




      </div>
    </div>
</WithSidebar>

    )
  }

  insertRow(address, index){
    return (

      <tr key={index}>
        <td>{ address.address }</td>
        <td>{ address.item_id !== null ?
            <Link to={`/${localStorage.getItem("store_number")}/home?item_id=${address.item_id}`}>{address.item_id + " - " + address.item_description}</Link>
            :
            "" }
        </td>
        <td>{ address.qty }</td>
      </tr>


    )
  }

  insertLetter(letter){
    return(
      <button key={letter} type="button" className="btn btn-outline-info btn-sm" onClick={ event => this.filterListByLetter(letter) }>{letter}</button>
    )
  }
}


export default Report;
