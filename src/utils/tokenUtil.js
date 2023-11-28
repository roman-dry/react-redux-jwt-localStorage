import { getLocalStorage } from "./localStorage";

export const isTokenPresent = () => {
  if (localStorage.getItem("token") !== null) {
    return true;
  }
  return false;
};

export const isTokenExp = () => {
  if (isTokenPresent()) {
    if (getLocalStorage("token").exp * 1000 - Date.now() < 36000000) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
};