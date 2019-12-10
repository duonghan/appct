import React from 'react';
import SwitchNavigator from 'react-navigation';

import Loading from './src/auth/Loading';
import SignUp from './src/auth/Signup';
import Login from './src/auth/Login';
import Main from './src/Main';

const App = SwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Main,
  },
  {
    initialRouteName: 'Loading',
  },
);
export default App;
