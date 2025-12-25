import MainRoutes from "./routes/mainroutes"
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