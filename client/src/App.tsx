
import './index.css';
import Profile from './pages/Profile/Profile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Profile />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
