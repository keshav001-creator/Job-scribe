import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../api/axios"
import ReactMarkdown from "react-markdown"

const OptmizedResume = () => {

  const { id } = useParams()

  const [suggestions, setSuggestions] = useState("")


  useEffect(() => {

    const fetchSuggestions = async () => {
      try {

        const res = await axios.post(`http://localhost:3000/api/resume/optimize/${id}`, {}, { withCredentials: true })
        // console.log(res.data.OptimizedResume)
        setSuggestions(res.data.OptimizedResume)

      } catch (err) {
        console.log(err)
      }
    }

    fetchSuggestions()
  }, [id])

  return (
    <div className="p-5 bg-gray-50">
      <h1 className="text-center text-2xl font-bold text-red-500 lg:text-4xl">AI Suggestions!</h1>
      {suggestions ? (
        <div className="mt-3 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-1 rounded-lg shadow-lg lg:p-10 lg:text-base">
          <div className="prose prose-sm lg:prose-base max-w-none">
            <ReactMarkdown>
              {suggestions}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <p className="text-center mt-4 text-gray-600">Generating Suggestions for Resume...</p>
      )}
    </div>
  )
}

export default OptmizedResume