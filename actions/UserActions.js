import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const startLogin = (loginValues) => {
  return async (dispatch) => {
    dispatch(isLoading());
    await axios
      .post("https://hidden-journey-49991.herokuapp.com/api/auth/loginUser", {
        loginValues: loginValues,
      })
      .then((res) => {
        if (res.data.ok) {
          console.log(res.data);
          try {
            storeData("expoToken", res.data.user.expoToken);
            storeData("uid", res.data.user.uid);
          } catch (error) {
            console.log(error);
          }
          dispatch(login(res.data.user));
        } else {
          console.log(res.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    dispatch(isNotLoading());
  };
};

const login = (user) => ({
  type: "USER_LOGIN",
  payload: user,
});

export const startSetSchedule = (
  uid,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  sunday
) => {
  return async (dispatch) => {
    dispatch(isLoading());
    await axios
      .post("https://hidden-journey-49991.herokuapp.com/api/auth/setSchedule", {
        uid,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      })
      .then((res) => {
        if (res.data.ok) {
          dispatch(setSchedule(res.data.user));
        } else {
          console.log(res.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    dispatch(isNotLoading());
  };
};

const setSchedule = (user) => ({
  type: "USER_SET_SCHEDULE",
  payload: user,
});

export const startStoreUserData = (uid, expoToken) => {
  return (dispatch) => {
    dispatch(storeUserData(uid, expoToken));
  };
};

const storeUserData = (uid, expoToken) => ({
  type: "SET_USER_DATA",
  payload: { uid, expoToken },
});

export const startGetUser = (uid) => {
  return async (dispatch) => {
    dispatch(isLoading());
    await axios
      .post("https://hidden-journey-49991.herokuapp.com/api/auth/getUser", {
        uid,
      })
      .then((res) => {
        if (res.data.ok) {
          dispatch(getUser(res.data.user));
        } else {
          console.log(res.data);
        }
        dispatch(isNotLoading());
      })
      .catch((e) => {
        console.log(e);
      });
  };
};

const getUser = (user) => ({
  type: "USER_GET",
  payload: user,
});

const isLoading = () => ({
  type: "FETCHING",
  payload: true,
});

const isNotLoading = () => ({
  type: "NOT_FETCHING",
  payload: false,
});
