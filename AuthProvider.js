// src/contexts/AuthProvider.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
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

  const refreshToken = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken(true); // Làm mới token từ Firebase
        const userData = await AsyncStorage.getItem("user");
        const userDataParsed = JSON.parse(userData);

        if (userDataParsed) {
          userDataParsed.token = token; // Cập nhật token mới
          await AsyncStorage.setItem("user", JSON.stringify(userDataParsed)); // Lưu lại AsyncStorage
          setUser(userDataParsed); // Cập nhật vào state
        }
      }
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error);
    }
  };

  const printTokenInfo = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken(true);

        // Decode token payload (phần thứ 2 của JWT)
        const tokenParts = JSON.parse(decodeBase64Url(token.split('.')[1]));

        const issuedAt = new Date(tokenParts.iat * 1000); // Convert từ giây sang mili-giây
        const expiresAt = new Date(tokenParts.exp * 1000); // Convert từ giây sang mili-giây

        console.log('Token được tạo vào:', issuedAt);
        console.log('Token hết hạn vào:', expiresAt);
      } else {
        console.log('Không có người dùng đăng nhập.');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin token:', error);
    }
  };

  const decodeBase64Url = (base64Url) => {
    // Thay thế các ký tự không hợp lệ trong URL và thêm padding nếu cần
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return atob(base64);
  };

  const handleAuthError = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.getIdToken(true); // Làm mới token từ Firebase
      }
    } catch (error) {
      if (error.code === "auth/id-token-expired") {
        Alert.alert(
          "Phiên đăng nhập đã hết hạn",
          "Vui lòng đăng nhập lại để tiếp tục sử dụng.",
          [
            {
              text: "Đăng nhập lại",
              onPress: () => logout(), // Chuyển đến màn hình đăng nhập
            },
          ]
        );
      } else {
        console.error("Lỗi khi xử lý xác thực:", error);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await saveUserToStorage(user);
      setUser(user);
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
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
    <AuthContext.Provider value={{ user, login, logout, loading, printTokenInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
