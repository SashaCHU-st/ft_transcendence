
import './index.css';
import AppRouter from './router/AppRouter'
import Profile from './pages/Profile/Profile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <AppRouter/>
      {/* <Profile /> */}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
