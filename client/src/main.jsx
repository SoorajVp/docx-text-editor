import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContextProvider from './contexts/Provider.jsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast"
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js';
import './index.css'

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="364668099021-5ka3pobjqunoduedu4m8g51s0j9b8jcg.apps.googleusercontent.com">
        <Toaster
          position="bottom-right"
          containerStyle={{
            fontFamily: "serif",
            fontSize: "14px",
          }}
          reverseOrder={false}
        />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </ContextProvider>,
);
