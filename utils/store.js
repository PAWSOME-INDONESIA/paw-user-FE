import { AsyncStorage } from "react-native";

export async function storeToken(user) {
  try {
    const item = await AsyncStorage.setItem("@session", JSON.stringify(user));
    return item
  } catch (error) {
    console.log("Something went wrong", error);
  }
}

export async function getToken() {
  try {
    let userData = await AsyncStorage.getItem("@session");
    let data = JSON.parse(userData);

    return data
  } catch (error) {
    console.log("Something went wrong", error);
  }
}