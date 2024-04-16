import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF().then(() => {
    window.csrfFetch = csrfFetch;      // Attach csrfFetch to window for easy access in development.
    window.store = store;              // Attach store to window for debugging.
    window.sessionActions = sessionActions; // Attach sessionActions to window for debugging.
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
