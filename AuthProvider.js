// src/contexts/AuthProvider.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Đăng ký lắng nghe sự thay đổi trạng thái xác thực
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await saveUserToStorage(user);
        setUser(user); // Người dùng đã đăng nhập
        const tokenResult = await user.getIdTokenResult();
        const tokenExpiryTime = new Date(tokenResult.issuedAtTime);
        const expirationTime = new Date(
          tokenExpiryTime.setMinutes(tokenExpiryTime.getMinutes() + 1)
        );
        const currentTime = new Date();
        console.log(expirationTime)
        if (expirationTime < currentTime) { 
          Alert.alert(
            "Phiên đăng nhập hết hạn",
            "Token đã hết hạn. Vui lòng đăng nhập lại.",
            [
              {
                text: "OK",
                onPress: async () => {
                  await logout();
                },
              },
            ]
          );
        }
      } else {
        await AsyncStorage.removeItem("user");
        setUser(null); // Không có người dùng hoặc đã đăng xuất
      }
      setLoading(false); // Kết thúc trạng thái loading
    });

    return () => unsubscribe(); // Hủy đăng ký khi component unmount
  }, []);

  const saveUserToStorage = async (user) => {
    try {
      const token = await user.getIdToken();
      const userData = {
        uid: user.uid,
        email: user.email,
        token,
      };
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await saveUserToStorage(user);
      setUser(user);
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-credential":
          Alert.alert(
            "Đăng nhập thất bại",
            "Email hoặc mật khẩu không chính xác"
          );
          break;
        case "auth/wrong-password":
          Alert.alert("Đăng nhập thất bại", "Mật khẩu không chính xác.");
          break;
        case "auth/user-not-found":
          Alert.alert("Đăng nhập thất bại", "Không tìm thấy email");
          break;
        default:
          Alert.alert(
            "Đăng nhập thất bại",
            "Email hoặc mật khẩu không chính xác."
          );
          break;
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
