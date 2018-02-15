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
      letter : "",
      loading : true,
      departmentsList : [],
      department: "all",
      error : ""
    }
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




  render(){

    return(

      <WithSidebar newState={this.props.newState} logOut={this.props.logOut}>
        <div className = "jumbotron container">
          <div className = "container" style={{position:"relative"}}>{ this.state.loading ? <i className="fa fa-hourglass-start fa-2x" style={{position:"absolute",top:"10px",right:"10px"}}></i> : null}
          <h1 className="text-center">Stock report</h1>

          <nav className="navbar navbar-light bg-light">
            <div className="col">
              Department : <select className="btn btn-outline-info btn-sm" name="department" value={this.state.department_description} onChange={event => this.filterListByDepartment(event.target.value)}>
                <option key="all" value="all">( All departments )</option>;
                {this.state.departmentsList.map((department) => {
                  return <option key={department.department_description} value={department.department_description}>{department.department_description}</option>;
                })}
              </select>
            </div>

            <div className="col">
              <button type="button" className={`btn aisleLetter btn-sm ${this.state.letter === "all" ? "active" : ""}`} onClick={ event => this.filterListByLetter("all") }>(All)</button>
              { this.state.lettersList.map( (letter) => this.insertLetter(letter))}
            </div>

          </nav>

          <table className="table table-hover text-center">
            <thead>
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
