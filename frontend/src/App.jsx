import Mainroutes from "./routes/Mainroutes"
import { JobsProvider } from "./context/JobContext"
import "./index.css";


const App = () => {
  return (

    <JobsProvider>
      <Mainroutes />
    </JobsProvider>

  )
}

export default App