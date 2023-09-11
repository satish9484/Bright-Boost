// ENV CONSTANTS
export const { REACT_APP_API_BASE: API_BASE } = process.env;
export const { REACT_APP_NAME: APP_NAME } = process.env;

// LOCALSTORAGE KEYNAME
export const LS_USER = `user${APP_NAME}`
export const LS_AUTHTOKEN = `authToken${APP_NAME}`

// TYPES FOR REDUCER
export const LOGIN_S = `LOGIN_S`;
export const LOGIN_F = `LOGIN_F`;

export const USER_LIST_S = `USER_LIST_S`;
export const USER_LIST_F = `USER_LIST_F`;

export const USER_INFO_S = `USER_INFO_S`;
export const USER_INFO_F = `USER_INFO_F`;

// API ENDPOINTS
export const API_LOGIN = `admin/login`;

export const API_USER_LIST = `admin/userList`;
export const API_USER_INFO = `admin/userInfo`;