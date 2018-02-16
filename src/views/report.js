import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';

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
      letter : "all",
      loading : true,
      departmentsList : [],
      department: "all",
      error : ""
    }
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
        lettersList : this.buildUniqueLettersList()
      });

      this.buildDepartmentsList();
    })
    .then(result => fetch(`${serverUrl}/${this.props.match.params.store}/addresses`))
    .then(response => response.json())
    .then(result => {
      this.calculateFreeRate(result)
    })
    .catch(error => {
        console.log(error);
    });

  }

  buildUniqueLettersList(){
    const arrayLetters = this.state.addressesList.map(address => address.address.substring(0,1));
    return Array.from(new Set(arrayLetters));
  }

  // -------------------------
  // build the department list
  // -------------------------
  buildDepartmentsList(){

    return fetch(`${serverUrl}/department`)
    .then(response => response.json())
    .then(result => {

      this.setState({
        departmentsList : result
      });
    })
    .catch(error => {
        console.log(error);
    });

  }

  // ------------------------------
  // filter the array by department
  // ------------------------------
  filterListByDepartment(department){

    this.setState({
      ...this.setState,
      department : department
    }, () => this.filterArray());
  }

  // --------------------------
  // filter the array by letter
  // --------------------------
  filterListByLetter(letter){

    this.setState ({
      ...this.setState,
      letter : letter
    }, () => this.filterArray());
  }

  filterArray(){
    // console.log("letter : "+this.state.letter);
    // console.log("department : "+this.state.department);
    let newList = [];
    if (this.state.letter === "all" && this.state.department === "all"){
      newList = this.state.addressesList;
    } else if (this.state.letter === "all" && this.state.department !== "all"){
      newList = this.state.addressesList.filter(address => address.department_description === this.state.department);
    } else if (this.state.letter !== "all" && this.state.department === "all"){
      newList = this.state.addressesList.filter(address => address.address.substring(0,1) === this.state.letter);
    } else if (this.state.letter !== "all" && this.state.department !== "all"){
      newList = this.state.addressesList.filter(address => address.address.substring(0,1) === this.state.letter && address.department_description === this.state.department);
    }

    this.setState ({
      ...this.setState,
      filteredList : newList
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
          <h2 className="text-center">Stock report</h2>
          {this.drawChart()}
          <h6 className="text-center"><em>Availability : {this.state.freeRate} %</em></h6>

          <table className="table table-hover text-center">
            <thead>
              <tr className="selectLine">
                <td>
                  <select className="btn aisleLetter" name="department" value={this.state.department_description} onChange={event => this.filterListByDepartment(event.target.value)}>
                    <option key="all" value="all">All sports</option>;
                    {this.state.departmentsList.map((department) => {
                      return <option  key={department.department_description} value={department.department_description}>{department.department_description.substring(0,20)}</option>;
                    })}
                  </select>
                </td>
                <td colSpan="2">
                  <button type="button" className={`btn aisleLetter btn-sm ${this.state.letter === "all" ? "active" : ""}`} onClick={ event => this.filterListByLetter("all") }>All</button>
                  { this.state.lettersList.map( (letter) => this.insertLetter(letter))}
                </td>
              </tr>
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
            <Link to={`/${localStorage.getItem("store_number")}/home?item_id=${address.item_id}`} className="clickableText">{address.item_id + " - " + address.item_description}</Link>
            :
            "" }
        </td>
        <td>{ address.qty }</td>
      </tr>


    )
  }

  insertLetter(letter){
    return(
      <button key={letter} type="button" className={`btn aisleLetter btn-sm ${this.state.letter === letter ? "active" : ""}`} onClick={ event => this.filterListByLetter(letter) }>{letter}</button>
    )
  }
}


export default Report;
