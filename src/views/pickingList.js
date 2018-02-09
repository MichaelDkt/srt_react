import React, { Component } from 'react';
import '../index.css';

class PickingList extends Component {

  constructor(props){
    super(props);
    this.state = {
      pickingList : [],
      loading : true
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // ------------------------
  // retrieve my picking list
  // ------------------------
  componentDidMount(){

    console.log('store : ' + this.props.match.params.store );
    console.log('email : ' + this.props.match.params.email );

    // return fetch(`/1234/pickingList/dominique`)
    //@todo : recuperer l'email de la personne connectée
    return fetch(`/${this.props.match.params.store}/pickingList/fabien.lebas@decathlon.com`)
    .then(response => response.json())
    .then(result => {
      this.setState({
        pickingList : result,
        loading : false
      });
      console.log(this.state.pickingList);
    })
    .catch(error => {
        console.log(error);
    });

  }

/*
  insertRow(product){
    return (
      <tr key={ product.id_picking_list }>
        <td>
          { product.address }
        </td>
        <td>
          { product.item_code }
        </td>
        <td>
          { product.item_description }
        </td>
        <td>
          <div className="row">
            <div className="col">
              <input type="text" className="form-control form-control-sm" value={ product.qty } onChange={event => this.handleChange(event, product.id_picking_list)} />
            </div>
            <div className="col">
              <button className="btn btn-primary btn-sm" onClick={event => this.pickItem(product.id_picking_list, product.item_code, product.qty, product.address)}>pick</button>
            </div>
          </div>
        </td>
        <td>
          <i className="fa fa-trash" onClick={event => this.deletePickingRow(product.id_picking_list)}></i>
        </td>
      </tr>
    );
  }
*/
  // -------------------------------
  // insert a row in my picking list
  // -------------------------------
  insertRow(product){
    return (
      <div>
        <div className="row">
          <div className="col-8">
            <span className="text-muted">{ product.item_code } - { product.item_description }</span>
          </div>
          <div className="col-4">
            <button className="btn btn-sm btn-block btn-danger" onClick={event => this.deletePickingRow(product.id_picking_list)}><i className="fa fa-trash"></i></button>
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-5">
            <span className="text-light bg-dark">{ product.address }</span>
          </div>
          <div className="col-3">
            <input type="text" className="form-control form-control-sm" value={ product.qty } onChange={event => this.handleChange(event, product.id_picking_list)} />
          </div>
          <div className="col-4">
            <button className="btn btn-success btn-sm btn-block" onClick={event => this.pickItem(product.id_picking_list, product.item_code, product.qty, product.address)}>Pick</button>
          </div>
        </div>
        <hr />
      </div>
    )
  }

  // ----------------------
  // modify the qty to pick
  // ----------------------
  handleChange(event, id_picking_list){

    this.setState ({
      ...this.state,
      loading : true
    });

    // read all the pickingList to change the state.
    const newPickingList = this.state.pickingList.map(product => {
      if (product.id_picking_list === id_picking_list) {
        product.qty = event.target.value;
      }
      return product;
    });
    console.log('newPickingList : '+JSON.stringify(newPickingList) );
    this.setState({pickingList : newPickingList});

    // update the qty in the pickinglist
    return fetch(`/${this.props.match.params.store}/pickingList/${id_picking_list}`,{
      headers: {
        // 'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify({ "qty" : event.target.value })
    })
    .then(response => response.json())
    .then(result => {
      this.setState ({
        ...this.state,
        loading : false
      });
    })
    .catch(error => {
        console.log(error);
    });
  }

  // ---------------------------------
  // delete a row from my picking list
  // ---------------------------------
  deletePickingRow(id_picking_list){

    this.setState ({
      ...this.state,
      loading : true
    });

    return fetch(`/${this.props.match.params.store}/pickingList/${id_picking_list}`,{
      headers: {
        // 'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      method: "DELETE"
    })
    .then(response => response.json())
    .then(result => {
      this.componentDidMount();
    })
    .catch(error => {
        console.log(error);
    });
  }

  // -------------------------------------------------------------
  // pick an Item from my pickingList, for a qty, and an addresses
  // -------------------------------------------------------------
  pickItem(id_picking_list, item_id, qty, address){
    console.log(id_picking_list+"/"+item_id+"/"+qty+"/"+address);

    /*
    this.setState({
      loading : true
    });
    */

    this.setState ({
      ...this.state,
      loading : true
    });

    // first fetch to pick an item with (x) qty from one address
    return fetch(`/${this.props.match.params.store}/addresses/${address}`,{
      headers: {
        // 'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify(
        {
        	"store": this.props.match.params.store,
        	"address" : address,
        	"item_id" : item_id,
        	"qty" : -1*qty
        }
      )
    })
    .then(response => response.json())
    .then(result => {
      // second fetch to remove the picking list line
      this.deletePickingRow(id_picking_list);
    })
    .then(
      this.setState ({
        ...this.state,
        loading : false
      })
    )
    .catch(error => {
        console.log(error);
    });


  }


  render(){
    return(
      <div className = "container" style={{position:"relative"}}>
        <h1 className="text-center">Picking List</h1>{ this.state.loading ? <i className="fa fa-hourglass-start fa-2x" style={{position:"absolute",top:"10px",right:"10px"}}></i> : null}

        { /*
        <div className="table-responsive-sm">
          <table className="table table-bordered table-sm">
            <thead className="thead-dark">
              <tr><th>Address</th><th>Item</th><th>Label</th><th>Picking Qty</th><th>{ this.state.loading ? <i className="fa fa-hourglass-start"></i> : null}</th></tr>
            </thead>
            <tbody>
              { this.state.pickingList.map( (product) => this.insertRow(product) ) }
            </tbody>
          </table>
        </div>
        */ }
        <div>
        <hr />
        { this.state.pickingList.map( (product) => this.insertRow(product) ) }
        </div>
      </div>

    );
  }
}


export default PickingList;
