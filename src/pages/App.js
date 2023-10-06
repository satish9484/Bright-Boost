import React, { Suspense } from "react";
// import axios from "axios";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";
import ScrollToTop from "../components/common/scroll";
import Loader from "../components/common/loader";
// import { setupAxios } from "../utils";
import { store } from "../Redux/store";
// import { AuthContextProvider } from "../context/AuthContext";

const { PUBLIC_URL } = process.env;

// setupAxios(axios, store);

const AppContainer = () => (
  <Provider store={store}>
    <Suspense fallback={<Loader isSuspense />}>
      <Loader>
        {/* <AuthContextProvider> */}
        <BrowserRouter basename={PUBLIC_URL}>
          <ScrollToTop>
            <Routes />
          </ScrollToTop>
        </BrowserRouter>
        {/* </AuthContextProvider> */}
      </Loader>
    </Suspense>
  </Provider>
);

export default AppContainer;
