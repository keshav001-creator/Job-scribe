import MainRoutes from "./routes/MainRoutes"
import { JobsProvider } from "./context/JobContext"
import "./index.css";


const App = () => {
  return (

    <JobsProvider>
      <MainRoutes />
    </JobsProvider>

  )
}

export default App