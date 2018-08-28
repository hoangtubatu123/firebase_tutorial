import React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import firebase from 'react-native-firebase';
import { NavigationActions, StackActions } from 'react-navigation';
import { LoginManager, LoginButton, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from 'react-native-google-signin';
export default class LoginComponent extends React.Component {
  constructor() {
    super();
    this.unsubcribe = null;
    this.state = {
      email: '',
      password: '',
      user: null
    };
  }

  componentDidMount() {
    // lấy dữ liệu lần trước mình đăng nhập
    this.unsubcribe = firebase.auth().onAuthStateChanged(changUser => {
      this.setState({ user: changUser });
    });

    // config google signin
    GoogleSignin.configure({
      iosClientId:
        '307682658570-64g3irkfpku66pfo4u0kqasg47ce89fb.apps.googleusercontent.com' // for ios only
    });
  }

  componentWillUnmount() {
    if (this.unsubcribe) {
      this.unsubcribe();
    }
  }
  loginAnonymously = () => {
    firebase
      .auth()
      .signInAnonymously()
      .then(user => {
        console.log(user);
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Home' })]
        });
        this.props.navigation.dispatch(resetAction);
      });
  };
  // login with email and password firebase
  loginWithEmail = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.props.navigation.navigate('Home');
      })
      .catch(err => {
        console.log(err);
      });
  };
  register = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        Alert.alert(
          'Alert Title',
          'My Alert Msg',
          [
            {
              text: 'OK',
              onPress: () => this.props.navigation.navigate('Home')
            }
          ],
          { cancelable: false }
        );
      })
      .catch(err => console.log(err));
  };
  // login with google
  loginGoogle = () => {
    GoogleSignin.signIn()
      .then(data => {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken,
          data.accessToken
        );
        return firebase.auth().signInWithCredential(credential);
      })
      .then(currentUser => {
        this.props.navigation.navigate('Home');
      })
      .catch(err => {
        console.log(err);
      });
  };

  // login Facebook
  loginFaceBook = () => {
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then(result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString()
          );
          return AccessToken.getCurrentAccessToken();
        }
      })
      .then(data => {
        const credential = firebase.auth.FacebookAuthProvider.credential(
          data.accessToken
        );
        return firebase.auth().signInWithCredential(credential);
      })
      .then(currentUser => {
        console.log(currentUser);
        this.props.navigation.navigate('Home');
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <TouchableOpacity
          style={[style.button, { backgroundColor: 'pink' }]}
          onPress={this.loginAnonymously}
        >
          <Text>{'Anonymous'}</Text>
        </TouchableOpacity>

        <TextInput
          style={style.input}
          onChangeText={text => {
            this.setState({ email: text });
          }}
          value={this.state.email}
          placeholder="email"
        />
        <TextInput
          secureTextEntry
          style={style.input}
          onChangeText={text => {
            this.setState({ password: text });
          }}
          value={this.state.password}
          placeholder="password"
        />

        <View syle={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[style.button, { backgroundColor: 'green' }]}
            onPress={this.loginWithEmail}
          >
            <Text>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[style.button, { backgroundColor: 'pink' }]}
            onPress={this.register}
          >
            <Text>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[style.button, { backgroundColor: 'red' }]}
            onPress={this.loginGoogle}
          >
            <Text>Login Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[style.button, { backgroundColor: 'blue', marginTop: 10 }]}
            onPress={this.loginFaceBook}
          >
            <Text>Login Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const style = StyleSheet.create({
  button: {
    marginTop: 10,
    height: 30,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    height: 30,
    width: 300,
    backgroundColor: 'transparent',
    marginTop: 10,
    borderWidth: 1
  }
});
