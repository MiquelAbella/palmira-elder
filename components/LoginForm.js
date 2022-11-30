import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { startLogin } from "../actions/UserActions";

export const LoginForm = ({ setIsLoginFormOpen }) => {
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  const handleGoBack = () => {
    setIsLoginFormOpen(false);
  };

  const [loginValues, setLoginValues] = useState({
    lemail: "",
    lpassword: "",
  });

  const handleSubmitForm = async () => {
    // if (backgroundLocationPermission && foregroundLocationPermission) {
    dispatch(startLogin(loginValues));
    // } else {
    //   let { fgStatus } = await Location.requestForegroundPermissionsAsync();
    //   let { bgStatus } = await Location.requestBackgroundPermissionsAsync();
    //   console.log(fgStatus, bgStatus);
    //   if (fgStatus === "granted") {
    //     setForegroundLocationPermission(true);
    //   }
    //   if (bgStatus === "granted") {
    //     setBackgroundLocationPermission(true);
    //   }
    //   if (backgroundLocationPermission || foregroundLocationPermission) {
    //     Alert.alert(
    //       "Debe activar los permisos de ubicación",
    //       "Desinstale e instale la aplicación para aceptar los permisos"[
    //         { text: "OK" }
    //       ]
    //     );
    //   }
    // }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack}>
        <Text style={styles.backButton} onPress={handleGoBack}>
          Atrás
        </Text>
      </TouchableOpacity>
      <Text style={styles.title}>Entra</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={loginValues.lemail}
        onChangeText={(text) =>
          setLoginValues({ ...loginValues, lemail: text })
        }
      />
      <TextInput
        secureTextEntry={true}
        style={styles.input}
        placeholder="Contraseña"
        value={loginValues.lpassword}
        onChangeText={(text) =>
          setLoginValues({ ...loginValues, lpassword: text })
        }
      />
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitForm}
        >
          <Text style={styles.button}>Acceda</Text>
        </TouchableOpacity>
      )}
    </View>
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
    fontSize: 50,
    color: "grey",
    marginBottom: 30,
  },
  touchable: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 250,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    marginBottom: 25,
  },
  button: {
    color: "grey",
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#e3e3e3",
    padding: 10,
    borderRadius: 7.5,
    marginTop: 25,
    width: 150,
    textAlign: "center",
  },
  touchable: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  redirectTxt: {
    marginTop: 25,
  },
  backButton: {
    position: "absolute",
    bottom: 0,
    right: 100,
    textDecorationLine: "underline",
    color: "grey",
  },
});
