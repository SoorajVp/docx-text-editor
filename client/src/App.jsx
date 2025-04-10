import MainRoutes from './routes/MainRoutes'
import './App.css'
import TabTitle from './components/layout/TabTitle';
import { Toaster } from 'react-hot-toast';

function App() {


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
