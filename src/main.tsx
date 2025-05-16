import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store"; // Đảm bảo import đúng file store của Redux
import App from "./App";
import { NotificationProvider } from './hooks/useNotification'; // Đảm bảo import đúng file NotificationProvider của bạn
import { BrowserRouter } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.Fragment>
    <BrowserRouter>
    <NotificationProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NotificationProvider>
    </BrowserRouter>
  </React.Fragment  >
);