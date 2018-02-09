import React, { Component } from 'react';
import '../index.css';

class Home extends Component {
<<<<<<< Updated upstream
  constructor(props){
    super(props);
    this.state = {
      item_id: "page",
      item_description: " ",
      stock: [],
      valueItem: "",
      valueAddress: "",
      valueQty: "",
      valueModal: ""
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
    return fetch(`/${this.props.match.params.store}/items/${item_id}`)
      .then(result => result.json())
      .then(result => {
        console.log(result);
        this.setState({
          ...this.state,
          item_id: result.item_id,
          item_description: result.item_description,
          stock: result.stock
        });
        return result;
      })
  }

  pick(address, item_id, qty){
    fetch(`/${this.props.match.params.store}/addresses/${address}`,{
      headers: {
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify({
        item_id: item_id,
        qty: - qty
      })
    })
    .then(result => result.json())
    .then(result => {
      this.getItemDetails(this.state.item_id);
    })
  }

  addStock(){
    console.log("add stock " + this.state.valueQty);
  }

  addToPickingList(){
    console.log("add to picking list " + this.state.valueAddress + this.state.valueQty);
  }

  allocationModule(){
    if(this.state.item_id !== "page") {
      return(
        <div className="container form-group row">
            <input type="text" className="form-control col-7" placeholder="Assign to address" value={this.state.valueAddress} onChange={this.handleChangeAddress} />
            <input type="text" className="form-control col-2" placeholder="Qty" value={this.state.valueQty} onChange={this.handleChangeQty} />
            <button type="button" className="btn btn-success" onClick={() => this.addToPickingList()}>OK</button>
        </div>
      )
    }
  }

  displayRow(stockInfo){
    return(
      <tr key={stockInfo.address_id}>
        <td className="to-center"><i className="fa fa-shopping-cart fa-2x" onClick={() => this.addToPickingList()}></i>
        </td>
        <td className="text-center to-center">{stockInfo.address}</td>
        <td className="text-center">
          <button type="button" className="btn btn-primary" data-toggle="modal" data-target={`#${stockInfo.address_id}`} onClick={() => this.setState({
              ...this.state,
              valueModal: stockInfo.qty
            })} > - </button>
          {stockInfo.qty}
          <button type="button" className="btn btn-primary" onClick={() => this.addStock(stockInfo.qty)}> + </button>
        </td>
      </tr>
    )
  }

  modal(stockInfo){
    return(
      <div key={stockInfo.address_id} className="modal fade" id={stockInfo.address_id} tabIndex="-1" role="dialog" aria-labelledby="modalPickTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalPickTitle">Picking item {this.state.item_id}</h5>
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
              <button type="button" className="btn btn-success" data-dismiss="modal" onClick={() => this.pick(stockInfo.address, stockInfo.item_id, this.state.valueModal)} >Pick</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render(){
      return(
        <div>
          <title>Item {this.state.item_id}</title>
          <div className = "jumbotron container">
            <h2>Item {this.state.item_id}</h2>
            <p>{this.state.item_description}</p>
            <div className="form-group row col-10 offset-1">
              <div>
                <input type="text" className="form-control" placeholder="Item code" value={this.state.valueItem} onChange={this.handleChangeItem} />
              </div>
              <button type="button" className="btn btn-success" onClick={() => this.getItemDetails(this.state.valueItem)}>OK</button>
=======
  render(){
      return(
        <div>
          <div className = "container">
          <h1>Home page</h1>
            <div className="search-box">
              <input value="Search" type="text" className="form-control" placeholder = "Search your code" onChange={e => console.log("hello")}/>
              <i className="glyphicon glyphicon-search"></i>
            </div>
            <div className="panel panel-info">
              <div className="panel-heading">
                <h3 className="panel-title">Item Code for { this.props.givenName }</h3>
              </div>
              <div className="panel-body">
                Item description
              </div>
>>>>>>> Stashed changes
            </div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-center">Address</th>
                  <th className="text-center">Stock</th>
                </tr>
              </thead>
              <tbody>
                {this.state.stock.map(stockInfo => this.displayRow(stockInfo))}
              </tbody>
            </table>
            {this.allocationModule()}
          </div>

          {this.state.stock.map(stockInfo => this.modal(stockInfo))}

        </div>
      );
  }
}


export default Home;
