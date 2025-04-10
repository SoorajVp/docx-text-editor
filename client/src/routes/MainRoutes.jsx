
import { useContext, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import DocumentViewer from '../components/document/DocViewer';
import LandingPage from '../components/LandingPage';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import CreateDocument from '../components/CreateDocument';
import UploadPage from '../pages/UploadPage';
import DetailsPage from '../pages/DetailsPage';
import BinFilesPage from '../pages/BinFilesPage';
import ProfilePage from '../pages/ProfilePage';
import Loading from '../components/Loading';
import EditingPage from '../pages/EditingPage';


function MainRoutes() {
   

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
                <Route path="/bin-files" element={<BinFilesPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/Loading" element={<Loading />} />

            </Route>
        </Routes>
    );
}

export default MainRoutes
