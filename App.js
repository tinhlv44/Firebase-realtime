// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './AuthProvider';
import LoginScreen from './screens/Login';
import Protected from './screens/Protected';
import { Text } from 'react-native';
import { SignUp } from './screens/SignUp';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Text>Đang tải...</Text>;  // Hiển thị trạng thái loading
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <>
          {/* <Stack.Screen name="MainApp" component={} /> */}
          <Stack.Screen name="Protected" component={Protected} />
        </>
      ) : (
        <>

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
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
