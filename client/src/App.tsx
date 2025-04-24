
import AppRouter from './router/AppRouter'
import './index.css';
import Profile from './pages/Profile/Profile';
import { Toaster } from 'react-hot-toast';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    {/* //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p> */}
      {/* <AppRouter/> */}
      <Profile />
      <Toaster position="top-right" reverseOrder={false} />
    </>
    
  )
}

export default App
