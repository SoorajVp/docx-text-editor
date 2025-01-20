
import { useContext, useEffect } from 'react'
import { MainContext } from './contexts/Provider'
import HomePage from './components/HomePage'
import EditingPage from './components/EditingPage'
import './App.css'

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

  return urlItems?.length > 0 ?
    <EditingPage /> :
    <HomePage />
}

export default App
