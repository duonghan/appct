import React from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';
import firebase from 'react-native-firebase';
import {AccessToken, LoginManager, LoginButton} from 'react-native-fbsdk';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscriber = null;

    this.state = {
      isAuthenticate: false,
      email: '',
      password: '',
      user: null,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged(changedUser => {
      this.setState({user: changedUser});
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(logedUser => {
        this.setState({user: logedUser});
        console.log(`Login with user: ${JSON.stringify(logedUser)}`);
      })
      .catch(err => {
        console.log(`Login failed with error: ${err}`);
      });
  };

  handleLoginWithFacebook = () => {
    LoginManager.logInWithPermissions(['pulic_profile', 'email'])
      .then(result => {
        console.log(
          `Login success with permission: ${result.grantedPermissions.toString()}`,
        );

        // get the access token
        return AccessToken.getCurrentAccessToken();
      })
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken,
        );

        return firebase.auth().signInWithCredential(credential);
      })
      .then(currentUser => {
        console.log(`Facebook login with user: ${JSON.stringify(currentUser)}`);
      })
      .catch(err => {
        console.log(`Login failed with error: ${err}`);
      });
  };

  handleRegister = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({user});
        console.log(`Registered with user: ${JSON.stringify(user)}`);
      })
      .catch(err => {
        console.log(`Register failed with error: ${err}`);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>

        <Text style={{color: 'red'}}>
          {this.state.errorMessage && this.state.errorMessage}
        </Text>

        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({password})}
          value={this.state.password}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <Button title="Register" onPress={this.handleRegister} />
        <LoginButton />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
});
