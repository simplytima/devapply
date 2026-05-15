import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';
import AppRoutes from "./routes/AppRoutes"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApplicationProvider>
          <AppRoutes />
        </ApplicationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App