import MainRoutes from './routes/MainRoutes'
import './App.css'
import TabTitle from './components/layout/TabTitle';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import ErrorPage from './components/error/ErrorPage';

function App() {
  const [errorType, setErrorType] = useState(null);

  useEffect(() => {
    const handleOffline = () => setErrorType("offline");
    const handleServerError = () => setErrorType("server");

    window.addEventListener("offline-error", handleOffline);
    window.addEventListener("server-error", handleServerError);

    return () => {
      window.removeEventListener("offline-error", handleOffline);
      window.removeEventListener("server-error", handleServerError);
    };
  }, []);

  if (errorType) return <ErrorPage type={errorType} />;

  return (
    <>
      <TabTitle />
      <Toaster reverseOrder={false} 
        position="bottom-right" 
        containerStyle={{ 
          fontFamily: "serif",
          fontSize: "16px",
        }}
       
      />
      <MainRoutes />
    </>
  );
}

export default App
