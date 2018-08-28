import { createStackNavigator } from 'react-navigation';
import LoginComponent from '../Component/LoginComponent';
import Home from '../Component/Home';

export const Main = createStackNavigator({
  Login: { screen: LoginComponent },
  Home: { screen: Home }
});
