
import AppRouter from './router/AppRouter'
import './index.css';
import { Toaster } from 'react-hot-toast';
// import NeonCursor from './components/NeonCursor';
//import Profile from './pages/Profile/Profile';

function App() {
  return (
    <>
      <AppRouter/>
	    {/* <NeonCursor /> */}
      {/* <Profile /> */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;