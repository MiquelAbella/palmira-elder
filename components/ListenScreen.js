import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  TouchableHighlight,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import * as Location from "expo-location";

import speechImg from "../assets/speechImg.png";
import { startGetUser } from "../actions/UserActions";

export const ListenScreen = () => {
  const dispatch = useDispatch();
  const { uid, elderName } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let { bgStatus } = await Location.requestBackgroundPermissionsAsync();
      }
    })();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const uid = await AsyncStorage.getItem("uid");

      if (uid !== null) {
        dispatch(startGetUser(uid));
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleSpeak = async () => {
    setIsLoading(true);
    let location = await Location.getCurrentPositionAsync({});

    let coords = [location.coords.latitude, location.coords.longitude];

    if (coords) {
      await axios
        .post(
          "https://hidden-journey-49991.herokuapp.com/api/auth/getSchedule",
          { uid }
        )
        .then(async (res) => {
          let days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          let hours = [
            "zero",
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            "nine",
            "ten",
            "eleven",
            "twelve",
            "thirteen",
            "fourteen",
            "fifteen",
            "sixteen",
            "seventeen",
            "eighteen",
            "nineteen",
            "twenty",
            "twentyone",
            "twentytwo",
            "twentythree",
          ];
          const schedule = res.data.schedule;
          const language = res.data.language;
          if (Object.keys(schedule).length) {
            let day = new Date().getDay();
            let hour = new Date().getHours();
            let minutes = new Date().getMinutes();

            let weekDay = days[day];
            let now = hours[hour];

            let textToSpeak = schedule[weekDay][now];

            let text = `${
              hour < 7
                ? "buenas noches"
                : hour < 13
                ? "buenos dias"
                : hour < 21
                ? "buenas tardes"
                : "buenas noches"
            } ${elderName}, hoy es ${
              day === 0
                ? "Domingo"
                : day === 1
                ? "Lunes"
                : day === 2
                ? "Martes"
                : day === 3
                ? "Miercoles"
                : day === 4
                ? "Jueves"
                : day === 5
                ? "Viernes"
                : "Sabado"
            } , son las ${hour} horas y ${minutes} minutos, ${
              textToSpeak ? textToSpeak : "haz lo que te apetezca"
            } `;

            if (language === "ca") {
              text = `${
                hour < 7
                  ? "bona nit"
                  : hour < 13
                  ? "bon dia"
                  : hour < 21
                  ? "bona tarda"
                  : "bona nit"
              } ${elderName}, avui és ${
                day === 0
                  ? "Diumenge"
                  : day === 1
                  ? "Dilluns"
                  : day === 2
                  ? "Dimarts"
                  : day === 3
                  ? "Dimecres"
                  : day === 4
                  ? "Dijous"
                  : day === 5
                  ? "Divendres"
                  : "Dissabte"
              } , son les ${hour} hores i ${minutes} minuts, ${
                textToSpeak ? textToSpeak : "fes el que et vingui de gust."
              } `;
            }

            Speech.speak(text, {
              language: language,
            });

            await axios.post(
              "https://hidden-journey-49991.herokuapp.com/api/auth/postInfo",
              {
                uid,
                text,
                coords,
              }
            );
          } else {
            if (language === "es-ES") {
              Speech.speak("Aún no se ha escrito nada", {
                language: language,
              });
            } else {
              Speech.speak("Encara no s'ha planificat res.", {
                language: language,
              });
            }
          }
        });
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity
          onPress={handleSpeak}
          style={{
            shadowColor: "rgba(0,0,0, .4)", // IOS
            shadowOffset: { height: 1, width: 1 }, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            backgroundColor: "#fff",
            elevation: 25, // Android
            height: 250,
            width: 250,
            borderRadius: 500,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Image style={styles.listenButton} source={speechImg} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  listenButton: {
    resizeMode: "stretch",
    height: 250,
    width: 250,
    backgroundColor: "#5d9afc",
    borderRadius: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 7.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
