var React = require('react');
var ReactDOM = require('react-dom');
var ProductList = require('./components/ProductList.jsx');
var AddProduct = require('./components/AddProduct.jsx');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

ReactDOM.render((<Router history={hashHistory}>
    <Route path="/" component={AddProduct} />
      <Route path="/product" component={ProductList} />
      <Route path="/product/add" component={AddProduct} />
  </Router>
 ), document.getElementById('container'));