import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableHighlight } from "react-native";
import { LoginForm } from "./LoginForm";
import * as Location from "expo-location";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { startStoreUserData } from "../actions/UserActions";

export const Main = () => {
  const dispatch = useDispatch();
  const [foregroundLocationPermission, setForegroundLocationPermission] =
    useState(false);
  const [backgroundLocationPermission, setBackgroundLocationPermission] =
    useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let { bgStatus } = await Location.requestBackgroundPermissionsAsync();

      if (status === "granted") {
        setForegroundLocationPermission(true);
      }
      if (bgStatus === "granted") {
        setBackgroundLocationPermission(true);
      }
    })();
  }, []);

  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

  const getData = async () => {
    try {
      const uid = await AsyncStorage.getItem("uid");
      const expoToken = await AsyncStorage.getItem("expoToken");
      if (uid !== null && expoToken !== null) {
        dispatch(startStoreUserData(uid, expoToken));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleOpenLoginForm = () => {
    setIsLoginFormOpen(true);
  };
  return (
    <>
      {!isLoginFormOpen ? (
        <View style={styles.container}>
          <Text style={styles.title}>Palmira</Text>
          <Text style={styles.subtitle}>
            Tu asistente virtual de proximidad para quien mas quieres
          </Text>
          <TouchableHighlight
            style={styles.touchable}
            onPress={handleOpenLoginForm}
          >
            <Text style={styles.button}>Empezar</Text>
          </TouchableHighlight>
          <Text style={styles.info}>
            *Para poder usar la aplicación debe aceptar los permisos de
            ubicación (siempre)
          </Text>
        </View>
      ) : (
        <LoginForm
          setIsLoginFormOpen={setIsLoginFormOpen}
          foregroundLocationPermission={foregroundLocationPermission}
          backgroundLocationPermission={backgroundLocationPermission}
          setForegroundLocationPermission={setForegroundLocationPermission}
          setBackgroundLocationPermission={setBackgroundLocationPermission}
        />
      )}
    </>
  );
};

let deviceHeight = window.innerHeight;
let deviceWidth = window.innerWidth;

const styles = StyleSheet.create({
  container: {
    height: deviceHeight,
    width: deviceWidth,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 75,
    color: "grey",
  },
  subtitle: {
    width: 250,
    textAlign: "center",
    color: "grey",
  },
  info: {
    width: 250,
    textAlign: "center",
    color: "grey",
    fontSize: 12.5,
    marginTop: 30,
  },
  button: {
    color: "grey",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#e3e3e3",
    padding: 10,
    borderRadius: 7.5,
    marginTop: 25,
    width: 100,
    textAlign: "center",
  },
  touchable: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
