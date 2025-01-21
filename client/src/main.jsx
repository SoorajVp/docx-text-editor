import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContextProvider from './contexts/Provider.jsx';
import { Toaster } from "react-hot-toast"
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <Toaster
      position="bottom-right"
      containerStyle={{
        fontFamily: "serif",
        fontSize: "14px"
      }}
      reverseOrder={false}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </ContextProvider>,
)
