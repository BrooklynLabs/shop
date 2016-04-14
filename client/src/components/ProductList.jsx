var React = require("react");
var httpService = require('../services/httpService.js');
//add oncomponentload type function 
var Product = React.createClass({
	getInitialState: function() {
	    return {
	      products : []
	    }
  	},
	componentWillMount : function(){
		var callback = (function(data){
			console.log(data);
			this.setState({
				products: data.result
			})
		}).bind(this);
		httpService.get('/api/v1/product', callback);
	},
	render: function() {
		return(
			<div>
			this is product
			</div>
		);
	}
});
module.exports= Product;