import React, { Component } from 'react';
import WithSidebar from './WithSidebar';
import '../index.css';

const serverUrl = process.env.REACT_APP_SERVERURL;

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      item_id: "page",
      item_description: " ",
      stock: [],
      valueItem: "",
      valueAddress: "",
      valueAddressId: "",
      valueQty: "",
      valueModal: "",
      alertMessage: null
    }
  }

  handleChangeItem = (event) => {
    this.setState({
      ...this.state,
      valueItem: event.target.value
    })
  }

  handleChangeAddress = (event) => {
    this.setState({
      ...this.state,
      valueAddress: event.target.value
    })
  }

  handleChangeQty = (event) => {
    this.setState({
      ...this.state,
      valueQty: event.target.value
    })
  }

  handleChangeModal = (event) => {
    this.setState({
      ...this.state,
      valueModal: event.target.value
    })
  }

  getItemDetails(item_id){
    return fetch(`${serverUrl}/${this.props.match.params.store}/items/${item_id}`)
      .then(result => result.json())
      .then(result => {
        this.setState({
          ...this.state,
          item_id: result.item_id,
          item_description: result.item_description,
          stock: result.stock
        });
        return result;
      })
  }

  stockMovement(address, item_id, qty, method){
    let myBody;
    if(method === "pick") {
      myBody = {
        item_id: item_id,
        qty: - qty
      };
    } else {
      myBody = {
        item_id: item_id,
        qty: qty
      };
    }
    console.log(`/${this.props.match.params.store}/addresses/${address}`);
    console.log(myBody);
    fetch(`${serverUrl}/${this.props.match.params.store}/addresses/${address}`,{
      headers: {
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify(myBody)
    })
    .then(result => result.json())
    .then(result => {
      this.setState({
        ...this.state,
        valueAddress: "",
        valueQty: "",
        alertMessage: null
      });
      this.getItemDetails(this.state.item_id);
    })
  }

  addToPickingList(stockInfo){
    const userEmail = this.props.newState.email;
    fetch(`${serverUrl}/${this.props.match.params.store}/pickingList`,{
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        stock_addresses_id: stockInfo.id,
        email: userEmail,
        qty: this.state.valueModal
      })
    })
    .then(result => result.json())
    ;
  }

  displayAlert(){
    if (this.state.alertMessage !== null){
      return(
        <div className="alert alert-danger alert-dismissible fade show" role="alert" aria-label="Open">
          <p>{this.state.alertMessage}</p>
          <button type="button" className="btn btn-secondary displayAlert" onClick={() => this.setState({
              ...this.state,
              alertMessage: null
            })} data-dismiss="alert" aria-label="Close">No</button>
          <button type="button" className="btn btn-warning displayAlert"  onClick={() => {
              if(this.state.alertMessage === "Address does not exist. Do you want to create it?"){
                this.createAddress();
              } else if (this.state.alertMessage === "Address is existing but was disabled previously. Do you want to re-enable it?"){
                this.enableAddress();
              }
            }} data-dismiss="alert" aria-label="Close">Yes</button>
        </div>
      )
    }
  }

  createAddress(){
    fetch(`${serverUrl}/${this.props.match.params.store}/addresses/${this.state.valueAddress}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    })
    .then(result => result.json())
    .then(result => {
      if(result.code === "201"){
        this.stockMovement(this.state.valueAddress, this.state.item_id, this.state.valueQty, "add");
      } else {
        this.setState({
          ...this.state,
          alertMessage: "Error during address creation, please try again"
        });
      }
    })
  }

  enableAddress(){
    fetch(`${serverUrl}/${this.props.match.params.store}/addresses/${this.state.valueAddressId}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body:JSON.stringify({
        disabled: false
      })
    })
    .then(result => result.json())
    .then(result => {
      if(result.code === "200"){
        this.stockMovement(this.state.valueAddress, this.state.item_id, this.state.valueQty, "add");
      } else {
        this.setState({
          ...this.state,
          alertMessage: "Error during address re-enabling, please try again"
        });
      }
    })
  }

  checkAddress(){
    console.log("checkAddress");
    console.log(`/${this.props.match.params.store}/addresses/${this.state.valueAddress}`);
    fetch(`${serverUrl}/${this.props.match.params.store}/addresses/${this.state.valueAddress}`)
      .then(result => result.json())
      .then(result => {
        if(!result.exists){
          console.log("n existe pas");
          this.setState({
            ...this.state,
            alertMessage: "Address does not exist. Do you want to create it?"
          });
        } else if (result.disabled){
          this.setState({
            ...this.state,
            valueAddressId: result.address_id,
            alertMessage: "Address is existing but was disabled previously. Do you want to re-enable it?"
          })
        } else {
          this.addressIsOK();
        }
      })

  }

  addressIsOK(){
    this.stockMovement(this.state.valueAddress, this.state.item_id, this.state.valueQty, "add");
  }

  allocationModule(){
    if(this.state.item_id !== "page") {
      return(
        <div className="container form-group row">
          <input type="text" className="form-control col-7" placeholder="Assign to address" value={this.state.valueAddress} onChange={this.handleChangeAddress} />
          <input type="text" className="form-control col-2" placeholder="Qty" value={this.state.valueQty} onChange={this.handleChangeQty} />
          <button type="button" className="btn btn-success" onClick={() => this.checkAddress()}>OK</button>
          {this.displayAlert()}
        </div>
      )
    }
  }

  displayRow(stockInfo){
    return(
      <tr key={stockInfo.address_id}>
        <td className="to-center"><i className="fa fa-shopping-cart fa-2x" data-toggle="modal" data-target={`#modal-${stockInfo.address_id}`} onClick={() => this.setState({
            ...this.state,
            valueModal: stockInfo.qty
          })}></i>
        </td>
        <td className="text-center to-center">{stockInfo.address}</td>
        <td className="text-center">
          <button type="button" className="btn btn-primary" data-toggle="modal" data-target={`#pick-${stockInfo.address_id}`} onClick={() => this.setState({
              ...this.state,
              valueModal: stockInfo.qty
            })} > - </button>
          {stockInfo.qty}
          <button type="button" className="btn btn-primary" data-toggle="modal" data-target={`#add-${stockInfo.address_id}`} onClick={() => this.setState({
              ...this.state,
              valueModal: 1
            })}> + </button>
        </td>
      </tr>
    )
  }

  modalPick(stockInfo){
    return(
      <div key={stockInfo.address_id} className="modal fade" id={`pick-${stockInfo.address_id}`} tabIndex="-1" role="dialog" aria-labelledby="modalPickTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalPickTitle">Picking item {this.state.item_id} in {stockInfo.address}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>{this.state.item_description}</p>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">Quantities picked</span>
                </div>
                <input type="text" className="form-control" value={this.state.valueModal} onChange={this.handleChangeModal} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-dismiss="modal"> Cancel </button>
              <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => this.stockMovement(stockInfo.address, stockInfo.item_id, this.state.valueModal, "pick")} >Pick</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  modalPutMoreStock(stockInfo){
    return(
      <div key={stockInfo.address_id} className="modal fade" id={`add-${stockInfo.address_id}`} tabIndex="-1" role="dialog" aria-labelledby="modalPickTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalPickTitle">Adding stock {this.state.item_id} in {stockInfo.address}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>{this.state.item_description}</p>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">Quantities added</span>
                </div>
                <input type="text" className="form-control" value={this.state.valueModal} onChange={this.handleChangeModal} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-dismiss="modal"> Cancel </button>
              <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => this.stockMovement(stockInfo.address, stockInfo.item_id, this.state.valueModal, "add")} >Add</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  modalAddToPickingList(stockInfo){
    return(
      <div key={stockInfo.address_id} className="modal fade" id={`modal-${stockInfo.address_id}`} tabIndex="-1" role="dialog" aria-labelledby="modalPickTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalPickTitle">Adding to picking list {this.state.item_id} in {stockInfo.address}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>{this.state.item_description}</p>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">Quantities added</span>
                </div>
                <input type="text" className="form-control" value={this.state.valueModal} onChange={this.handleChangeModal} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-dismiss="modal"> Cancel </button>
              <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => this.addToPickingList(stockInfo)} >Add</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render(){
      return(
        <WithSidebar newState={this.props.newState} logOut={this.props.logOut}>
          <div>
            <div className = "jumbotron container">
              <h2>Item {this.state.item_id}</h2>
              <p>{this.state.item_description}</p>
              <form className="form-group row col-10 offset-1" onSubmit={(event) => {
                  event.preventDefault();
                  this.getItemDetails(this.state.valueItem);
                } }>
                <div>
                  <input type="text" className="form-control" placeholder="Item code" value={this.state.valueItem} onChange={this.handleChangeItem} />
                </div>
                <button type="submit" className="btn btn-success" >OK</button>
              </form>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th></th>
                    <th className="text-center">Address</th>
                    <th className="text-center">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.stock.length === 0
                    ? (
                      this.state.item_id === "page"
                        ? null
                        : <tr><td colSpan="3">No stock</td></tr>
                      )
                    : this.state.stock.map(stockInfo => this.displayRow(stockInfo))
                  }
                </tbody>
              </table>
              {this.allocationModule()}
            </div>

            {this.state.stock.map(stockInfo => this.modalPick(stockInfo))}
            {this.state.stock.map(stockInfo => this.modalPutMoreStock(stockInfo))}
            {this.state.stock.map(stockInfo => this.modalAddToPickingList(stockInfo))}
          </div>
        </WithSidebar>
      );
  }
}


export default Home;
