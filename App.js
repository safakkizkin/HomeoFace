import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { MainCamera, Notifications } from './components';
import { LoginModel } from './models';
import Swiper from 'react-native-swiper';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isUserLoggedIn: false,
    }
  }

  async checkIfUserAlreadyLoggedIn() {
    const user = await AsyncStorage.getItem('@HomeoFace:user');
    const password = await AsyncStorage.getItem('@HomeoFace:password');

    if(user === null || password === null) {
      this.setState({isUserLoggedIn: false});
    } else {
      var loginModel = new LoginModel();
      loginModel.email = user;
      loginModel.password = password;
      try{
        let response = await fetch("https://api.homeocure.net/homeo/login/loginuser", {
          method: 'POST',
          headers: {
              'Authorization': 'Basic 0Tr0V+XwnVjhu26UIJim0Tr0Xw0kjydyd26U26Q7G6LQgxwVEC', //'Basic': '0Tr0V+XwnVjhu26UIJim0Tr0Xw0kjydyd26U26Q7G6LQgxwVEC',
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginModel),
        });
        if(response.ok) {
          this.setState({isUserLoggedIn: true});
        }
      } catch(error) {
        console.error(error);
      }
    }

    console.warn(this.state.isUserLoggedIn, user, password);
  }

  componentWillMount() {
    this.checkIfUserAlreadyLoggedIn();
  }

  render() {
    return (
      <Swiper loop={false} showsPagination={false} index={0}>
        <MainCamera isUserLoggedIn={this.state.isUserLoggedIn} />
        <Notifications style={styles.wrapper} />
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flex: 1
  }
  
});
