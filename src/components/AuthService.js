import axios from "axios";

const API_URL = "http://65.2.127.205:3000/api/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

//only logout and localstorage route 

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("username");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const setCurrentUser = (user) => {
 
    localStorage.setItem("user", JSON.stringify(user));
      };

  const setUsername = (username) => {
    localStorage.setItem("username", username); // Store the username separately    
  };

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return null;  // Return null if no user is found
};

const getUsername = () => {
  return localStorage.getItem("username"); // Retrieve the username directly
};

const AuthService = {
  register,
  // login,
  logout,
  getCurrentUser,
  setCurrentUser,
  setUsername,
  getUsername
}

export default AuthService;
