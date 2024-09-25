import React, { useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { AuthContext } from '../AuthProvider';
import { Button } from '../components';
import { Colors } from '../config';
import { useEffect } from 'react';

const Home = ({ navigation }) => {
  const { user, logout ,loading} = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Nếu người dùng không đăng nhập, chuyển hướng đến màn hình đăng nhập
        navigation.navigate("Login");
      }
    }
  }, [user, loading, navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return null; // Hoặc một cái gì đó phù hợp với trạng thái không có người dùng
  }

  return (
    <SafeAreaView style={{marginTop: 90}}>
      <Text>Chào mừng, {user.email} </Text>
      <Button style={styles.button} title={'Đăng xuất'} onPress={logout}>
      <Text style={styles.btn}>Đăng xuất</Text>
      </Button>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
    btn: {
        fontSize: 20,
        color: Colors.white,
        fontWeight: "700",
    },
    button: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        backgroundColor: Colors.orange,
        padding: 10,
        borderRadius: 8,
      },
  });
