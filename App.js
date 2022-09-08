import { Provider } from "react-redux";

import { SafeAreaProvider } from "react-native-safe-area-context";

import Routes from "./Routes";

import { store } from "./store/store";
import { useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import axios from "axios";
import { useMemo } from "react";
import { useState } from "react";
import { Text } from "react-native";

export default function App() {
  const [uid, setUid] = useState(null);
  const [expoToken, setExpoToken] = useState(null);
  useEffect(() => {
    getData();

    if (uid && expoToken) {
      (async () => {
        await Location.startLocationUpdatesAsync("getLocation", {
          accuracy: Location.Accuracy.High,
          timeInterval: 60000,
          distanceInterval: 0,
        });
      })();
    }
  }, [uid, expoToken]);

  const getData = async () => {
    try {
      const uid = await AsyncStorage.getItem("uid");

      if (uid) {
        await axios
          .post("https://hidden-journey-49991.herokuapp.com/api/auth/getUser", {
            uid,
          })
          .then((res) => {
            setUid(res.data.user.uid);
            setExpoToken(res.data.user.expoToken);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const sendPushNotification = async (expoToken, lat, lon) => {
    if (expoToken) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        mode: "no-cors",
        headers: {
          Accepts: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: expoToken,
          sound: "default",
          title: "Palmira",
          body: `Fuera de la ubicación establecida: ${lat}, ${lon}`,
        }),
      })
        .then((res) => {
          let response = JSON.stringify(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  TaskManager.defineTask("getLocation", ({ data, error }) => {
    if (error) {
      console.log(error);
      return;
    }
    if (data && uid && expoToken) {
      const { locations } = data;

      (async () => {
        await axios
          .post(
            "https://hidden-journey-49991.herokuapp.com/api/auth/postLocation",
            {
              uid: uid,
              coords: [
                locations[0].coords.latitude,
                locations[0].coords.longitude,
              ],
              timestamp: locations[0].timestamp,
            }
          )
          .then(async (res) => {
            if (res.data.ok) {
              console.log("location sent successfully", expoToken);

              let currLatitude = locations[0].coords.latitude;
              let currLongitude = locations[0].coords.longitude;
              await axios
                .post(
                  "https://hidden-journey-49991.herokuapp.com/api/auth/getUser",
                  { uid }
                )
                .then((res) => {
                  if (
                    res.data.ok &&
                    res.data.user.position.length &&
                    res.data.user.areNotificationsActive
                  ) {
                    let distance = getDistanceFromLatLonInM(
                      currLatitude,
                      currLongitude,
                      res.data.user.position[0],
                      res.data.user.position[1]
                    );

                    if (distance > res.data.user.minimumDistance) {
                      sendPushNotification(
                        expoToken,
                        locations[0].coords.latitude,
                        locations[0].coords.longitude
                      );
                    }
                  }
                })
                .catch((e) => {
                  console.log(e.message);
                });
            } else {
              console.log(res.data);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      })();
    }
  });

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Routes />
      </Provider>
    </SafeAreaProvider>
  );
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return Math.floor(d * 1000);
};
