import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { auth, database } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import {
  API_LOGIN,
  LOGIN_F,
  LOGIN_S,
  LS_AUTHTOKEN,
  LS_USER,
} from "../constants";

import { ref, set, get } from "firebase/database";

const initialState = {
  // Global loader for api
  isLoading: false,
  // Auth Data
  isLoggedIn: false,
  userData: {},
  error: null,
};

export const loginAction = (data) => ({
  type: "API",
  payload: {
    url: API_LOGIN,
    method: "POST",
    data: data,
    hideLoader: false,
    success: (data) => ({
      type: LOGIN_S,
      payload: data,
    }),
    error: (data) => ({
      type: LOGIN_F,
      payload: {},
    }),
  },
});

// Reducer
const loginSlice = createSlice({
  name: "login",
  initialState: initialState,
  reducers: {
    loaderChange: (state, payload) => {
      state.isLoading = payload.payload;
    },
    // Reducer to set the user data in the state
    setUser: async (state, action) => {
      console.log(action);
      await signInWithEmailAndPassword(
        auth,
        action.payload.email,
        action.payload.password
      )
        .then(async (userCredential) => {
          // Signed in
          console.log("SUCCESSFULLY LOGIN");
          // Access and print user  data
          console.log("User:", userCredential.user);

          const uid = userCredential.user.uid;

          try {
            const userRef = ref(database, `users/${uid}`);
            await set(userRef, { role: "admin" });
            console.log("Role updated successfully");
          } catch (error) {
            console.error("Error updating role:", error.message);
          }

          try {
            const userRef = ref(database, `users/${uid}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
              const userData = snapshot.val();
              const userRole = userData.role;

              console.log(userRole);
            } else {
              console.log("User data not found");
            }
          } catch (error) {
            console.error("Error fetching role:", error.message);
          }

          // localStorage.setItem(
          //   LS_AUTHTOKEN,
          //   JSON.stringify(await userCredential.user.getIdToken())
          // );
          localStorage.setItem(LS_USER, JSON.stringify(userCredential.user));

          state.userData = action.payload;
          state.isLoggedIn = true;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("User login ErrorCode " + errorCode);
          console.log("User login  Error Message " + errorMessage);
          // setErr(true);
        });
    },

    // Reducer to set the loading state in the state
    loading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Reducer to set the error message in the state
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LOGIN_S, (state, action) => {
      // Default header for auth
      axios.defaults.headers.common["Authorization"] =
        action.payload.data.token;
      localStorage.setItem(
        LS_AUTHTOKEN,
        JSON.stringify(action.payload.data.token)
      );
      localStorage.setItem(LS_USER, JSON.stringify(action.payload.data));

      state.userData = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(LOGIN_F, (state, action) => {
      // remove items on logout
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem(LS_AUTHTOKEN);
      localStorage.removeItem(LS_USER);

      state.userData = {};
      state.isLoggedIn = false;
    });
  },
});

export const { loaderChange, setUser, loading, setError } = loginSlice.actions;

export default loginSlice.reducer;
