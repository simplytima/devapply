import { ApplicationProvider } from './context/ApplicationContext';
import AppRoutes from "./routes/AppRoutes"

function App() {
  return (
    <ApplicationProvider>
      <AppRoutes />
    </ApplicationProvider>
  )
}

export default App