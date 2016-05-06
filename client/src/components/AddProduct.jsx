var React = require('react');
var Link = require('react-router').Link;
// add onclick listener
var AddProduct = React.createClass({
  render: function() {
    return (
      <div>
        <Link to={'/product'}>Products</Link>

      </div>
    )
  }
});

module.exports = AddProduct;
