import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);

    if (Date.now() >= exp * 1000) {
      return true;
    }
    return false;
  } catch (error) {
    return true;
  }
};
