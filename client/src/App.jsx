
import { useContext, useEffect } from 'react'
import { MainContext } from './contexts/Provider'
import EditingPage from './pages/EditingPage'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Layout from './components/layout/Layout'
import Profile from './components/Profile'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ProfilePage from './pages/ProfilePage'
import Loading from './components/Loading'
import BinFilesPage from './pages/BinFilesPage'
import DetailsPage from './pages/DetailsPage'
import DocumentViewer from './components/document/DocViewer'
import CreateDocument from './components/CreateDocument'

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
      <Route path="/test" element={<DocumentViewer />} />
      <Route path="/get-started" element={<LandingPage />} />

      <Route path='/' element={<Layout />} >
        <Route path="" element={<HomePage />} />
        <Route path="/edit" element={<EditingPage />} />
        <Route path="/create" element={<CreateDocument />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/doc/view/:id" element={<DetailsPage />} />
        <Route path="/bin" element={<BinFilesPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/Loading" element={<Loading />} />

      </Route>
    </Routes>
  );
}

export default App
