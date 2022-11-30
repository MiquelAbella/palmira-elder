import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Main } from "./components/Main";
import { ListenScreen } from "./components/ListenScreen";
import { useEffect } from "react";

export default function Routes({ setUid }) {
  const Stack = createNativeStackNavigator();

  const { uid } = useSelector((state) => state.auth);
  useEffect(() => {
    setUid(uid);
  }, [uid]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!uid ? (
          <Stack.Screen name="Main" component={Main} />
        ) : (
          <>
            <Stack.Screen name="Listen" component={ListenScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
});
