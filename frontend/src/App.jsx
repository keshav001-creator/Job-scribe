
import { JobsProvider } from "./context/JobContext"
import AppRoutes from "./routes/AppRoutes";
import "./index.css";


const App = () => {
  return (

    <JobsProvider>
      <AppRoutes/>
    </JobsProvider>

  )
}

export default App