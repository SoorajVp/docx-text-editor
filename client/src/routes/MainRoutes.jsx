
import { Route, Routes } from 'react-router-dom'
import DocumentViewer from '../components/document/DocViewer';
import LandingPage from '../components/LandingPage';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import CreateDocument from '../components/CreateDocument';
import DetailsPage from '../pages/DetailsPage';
import BinFilesPage from '../pages/BinFilesPage';
import ProfilePage from '../pages/ProfilePage';
import Loading from '../components/loading/Loading';
import DocumentPage from '../pages/DocumentPage';
import EditDocument from '../pages/EditDocument';
import EncryptedViewer from '../pages/EncryptedViewer';
import SharedFiles from '../pages/SharedFiles';
import NotFound from '../components/error/NotFound';
import UploadDocument from '../pages/UploadDocument';


function MainRoutes() {

    return (
        <Routes>
            <Route path="/test" element={<DocumentViewer />} />
            <Route path="/get-started" element={<LandingPage />} />
            <Route path="/document" element={<DocumentPage />} />
            <Route path="/shared/:accessId" element={<EncryptedViewer />} />

            <Route path="/" element={<LandingPage />} />

            <Route path='/' element={<Layout />} >
                <Route path="/files" element={<HomePage />} />
                {/* <Route path="/edit" element={<EditingPage />} /> */}
                <Route path="/create" element={<CreateDocument />} />
                <Route path="/upload" element={<UploadDocument />} />
                <Route path="/doc/view/:id" element={<DetailsPage />} />
                <Route path="/doc/edit/:id" element={<EditDocument />} />

                <Route path="/archive" element={<BinFilesPage />} />
                <Route path="/shared" element={<SharedFiles />} />
                <Route path="/profile" element={<ProfilePage />} />


            </Route>
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default MainRoutes
