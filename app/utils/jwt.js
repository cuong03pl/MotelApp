import jwt_decode from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    return jwt_decode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const getTokenData = (token) => {
  try {
    const decoded = jwt_decode(token);
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('Error getting token data:', error);
    return null;
  }
}; 