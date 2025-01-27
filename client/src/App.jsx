
import { useContext, useEffect } from 'react'
import { MainContext } from './contexts/Provider'
import EditingPage from './components/EditingPage'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Layout from './components/Layout'
import Profile from './components/Profile'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'

function App() {
  const urlItems = JSON.parse(localStorage.getItem("url_value"));
  const { setUrlContext, setIdContext } = useContext(MainContext)

  // Parse query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const urlId = queryParams.get("id");

  useEffect(() => {
    setIdContext(urlId || 0)
    setUrlContext(urlItems || null)
  }, [urlId])

  // return urlItems?.length > 0 ?
  //   <EditingPage /> :
  //   <HomePage />

  return (
    <Routes>
      <Route path="/get-started" element={<LandingPage />} />
      <Route path='/' element={<Layout />} >
        <Route path="" element={<HomePage />} />
        <Route path="/edit" element={<EditingPage />} />
        <Route path="/upload" element={<UploadPage />} />

        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App
