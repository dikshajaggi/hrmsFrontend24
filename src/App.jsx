import { RouterProvider } from "react-router-dom"
import router from "./routes/index.jsx"
import { LayoutProvider } from "./context/LayoutContext.jsx"

function App() {

  return (
    <>
    <LayoutProvider>
      <RouterProvider router={router} />
    </LayoutProvider>
    </>
  )
}

export default App
