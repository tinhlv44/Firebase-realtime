// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './AuthProvider';
import LoginScreen from './screens/Login';
import Home from './screens/Home';
import { ActivityIndicator, Text } from 'react-native';
import { SignUp } from './screens/SignUp';
import { ForgotPassword } from './screens/ForgotPassword';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);
  //console.log(user)
  if (loading) {
    return <ActivityIndicator style={{height: '100%'}} size="large" color="#00ff00" />  // Hiển thị trạng thái loading
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <>
          {/* <Stack.Screen name="MainApp" component={} /> */}
          <Stack.Screen name="Home" component={Home} />
        </>
      ) : (
        <>

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
