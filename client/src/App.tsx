
import AppRouter from './router/AppRouter'
import './index.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <AppRouter/>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;