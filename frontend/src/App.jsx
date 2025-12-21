import MainRoutes from "./routes/mainroutes"
import { JobsProvider } from "./context/JobContext"

const App = () => {
  return (

    <JobsProvider>
      <MainRoutes />
    </JobsProvider>

  )
}

export default App