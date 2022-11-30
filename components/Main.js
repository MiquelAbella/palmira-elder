import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  PermissionsAndroid,
  Alert,
  Linking
} from "react-native";
import { LoginForm } from "./LoginForm";
import * as Location from "expo-location";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { startStoreUserData } from "../actions/UserActions";

import Modal from "react-native-modal";

import locationIcon from "../assets/locationIcon.png";

export const Main = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [foregroundLocationPermission, setForegroundLocationPermission] =
    useState(false);
  const [backgroundLocationPermission, setBackgroundLocationPermission] =
    useState(false);

  const getPermissionsFromLocalStorage = async () => {
    let permission = await AsyncStorage.getItem("permissions");
   
    if (permission === "true") {
      setBackgroundLocationPermission(true);
    } else if (permission === "false") {
      Alert.alert(
        "Info",
        "Debe activar los permisos de ubicación para poder usar la aplicación. Vaya a configuración -> Aplicaciones -> Palmira -> Permisos -> Ubicación -> Permitir Siempre",
        [{ text: "OK" }]
      );
    } else {
      setIsModalVisible(true);
    }
  };

  useEffect(() => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    ).then(async (response) => {
      if (response === true) {
        setBackgroundLocationPermission(true);
        await AsyncStorage.setItem("permissions", "true");
      } else {
        getPermissionsFromLocalStorage();
      }
    });
  }, []);

  const handleAcceptLocationPermission = () => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      let { status } = await Location.requestBackgroundPermissionsAsync();

      if (status === "granted") {
        setBackgroundLocationPermission(true);
        setForegroundLocationPermission(true);
        await AsyncStorage.setItem("permissions", "true");
      } else {
        await AsyncStorage.setItem("permissions", "false");
      }
    })();
    setIsModalVisible(false);
  };

  const handleDenyLocationPermission = () => {
    console.log("denied");
  };

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
    if (backgroundLocationPermission) {
      setIsLoginFormOpen(true);
    } else {
      Alert.alert(
        "Info",
        "Debe activar los permisos de ubicación para poder usar la aplicación. Vaya a configuración -> Aplicaciones -> Palmira -> Permisos -> Ubicación -> Permitir Siempre",
        [{ text: "OK" }]
      );
    }
  };

  const handlePress = () => {
    Linking.openURL("https://miquelabella.github.io/palmira-desktop/");
  };
  return (
    <>
      {!isLoginFormOpen ? (
        <View style={styles.container}>
          <Modal isVisible={isModalVisible}>
            <View style={styles.modal}>
              <Image source={locationIcon} style={{ height: 50, width: 50 }} />
              <Text style={{ width: 275, fontSize: 15 }}>
                Palmira necesita obtener tu ubicación para almacenar los datos
                del lugar en que has usado la aplicación.
              </Text>
              <Text style={{ width: 275, fontSize: 15 }}>
                Palmira necesita obtener tu ubicación en segundo plano para
                enviar tu ubicación a la persona cuidadora en caso de que salgas
                fisicamente del radio máximo establecido por la persona
                cuidadora incluso cuando la aplicación esté cerrada o no esté en
                uso y también recoge datos que pueden ser usados para apoyar
                publicidad.
              </Text>
              <Button
                title="Permitir"
                onPress={handleAcceptLocationPermission}
              />
              <Button title="Denegar" onPress={handleDenyLocationPermission} />
            </View>
          </Modal>
          <Text style={styles.title}>Palmira</Text>
          <Text style={styles.subtitle}>
            Tu asistente virtual de proximidad para quien mas quieres
          </Text>
          <TouchableOpacity
            style={styles.touchable}
            onPress={handleOpenLoginForm}
          >
            <Text style={styles.button}>Empezar</Text>
          </TouchableOpacity>
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
      <Button title={"Política de privacidad"} onPress={handlePress} />
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
  modal: {
    height: 500,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
