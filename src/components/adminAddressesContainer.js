import React, { Component } from 'react';


class AdminAddressesContainer extends Component {

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


  // -----------------------------------------
  // retrieve the addresses list of this store
  // -----------------------------------------
  componentDidMount(){

    console.log('store : ' + this.props.match.params.store );

    return fetch(`/${this.props.match.params.store}/addresses`)
    .then(response => response.json())
    .then(result => {
      this.setState({
        addressesList : result,
        filteredList : result.filter(address => address.disabled === false),
        loading : false
      });
      this.setState({
        ...this.state,
        lettersList : this.buildUniqueLettersList()
      });

      console.log(this.state.addressesList);
      console.log(this.state.lettersList);
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
    console.log(event.target.checked);
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
    console.log('newlist : ' + newList);
  }

  // --------------------------
  // filter the array by letter
  // --------------------------
  filterListByLetter(letter){
    console.log(letter);
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
    console.log('newlist : ' + newList);
  }

  // ------------------
  // disable an address
  // ------------------
  disableAddress(id, targetState){
    console.log('id address to disable : '+id + "/" + targetState);
    this.setState ({
      ...this.state,
      loading : true
    });

    return fetch(`/${this.props.match.params.store}/addresses/${id}`,{
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
    console.log('id address to create : '+addressToCreate);
    this.setState ({
      ...this.state,
      loading : true
    });

    return fetch(`/${this.props.match.params.store}/addresses/${addressToCreate}`,{
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    })
    .then(response => response.json())
    .then(result => {
      console.log(result.code);
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


  render(){
    return(
      <div className = "container" style={{position:"relative"}}>{ this.state.loading ? <i className="fa fa-hourglass-start fa-2x" style={{position:"absolute",top:"10px",right:"10px"}}></i> : null}
        <h1 className="text-center">Addresses</h1>


        <nav class="navbar navbar-light bg-light">

          {/*
          <label>
             disabled :
            <input name="disabled" type="checkbox"  onChange={event => this.filterList(event)} />
          </label>
          */}
          <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModal">+</button>
          <button type="button" className="btn btn-info btn-sm" onClick={ event => this.filterListByLetter("removeFilter") }>(All)</button>
          { this.state.lettersList.map( (letter) => this.insertLetter(letter))}
        </nav>

        { this.state.filteredList.map( (address) => this.insertRow(address) ) }

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
                <p>bla bla bla bla</p>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">Enter your address (X-000) :</span>
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
    )
  }

  insertRow(address){
    return (
      <div className="row border-bottom" key={address.id}>
        <div className="col-3">
          <span className="text-light bg-dark">{ address.address }</span>
        </div>
        <div className="col-4">
          <span>{address.qty_ref} / {address.stock_total}</span>
        </div>
        <div className="col-2">
          {address.qty_ref === "0" && !address.disabled ?
          <button className="btn btn-sm btn-block btn-danger" title="delete this address" onClick={event => this.disableAddress(address.id, true)}><i className="fa fa-trash"></i></button>
          : null }
          { address.disabled ?
          <button className="btn btn-sm btn-block btn-warning" title="restore this address" onClick={event => this.disableAddress(address.id, false)}><i className="fa fa-backward"></i></button>
          : null }
        </div>


      </div>
    )
  }

  insertLetter(letter){
    console.log('the letter is : '+letter);
    return(
      <button type="button" className="btn btn-outline-info btn-sm" onClick={ event => this.filterListByLetter(letter) }>{letter}</button>
    )
  }



}


export default AdminAddressesContainer;
