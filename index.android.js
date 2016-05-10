/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image
} from 'react-native';
import { Card, Button } from 'react-native-material-design';


var DeviceInfo = require('react-native-device-info');

class Shopylytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products:[],
      recommedation:[]
    };
  }
  componentWillMount(){
    fetch('https://shopylytics.herokuapp.com/api/v1/product?role=USER&user_id=123')
      .then(response => response.text())
      .then(product=> {
        console.log(product);
        this.setState({
          products : JSON.parse(product).result
        })
      })
      .done();
      
  }
  render() {
    console.log(this.state);
    if(this.state.products)
    var products = this.state.products.map(function(product){
      return(
        <Card>
            <Card.Media
                image={<Image source={{uri : '{product.images}' }} style={{width: 400, height: 400}}/>}
                overlay
            />
            <Card.Body>
                <Text>{product.description}</Text>
            </Card.Body>
            <Card.Actions position="right">
                <Button value={product.seller_mrp} />
            </Card.Actions>
        </Card>
      );
    });

      return (
          <ScrollView>
              <View>
                  {products}
              </View>
          </ScrollView>
      );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Shopylytics', () => Shopylytics);
