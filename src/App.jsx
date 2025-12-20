import { RouterProvider } from "react-router-dom"
import router from "./routes/index.jsx"
import { LayoutProvider } from "./context/LayoutContext.jsx"
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <>
    <LayoutProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-center"
      />
    </LayoutProvider>
    </>
  )
}

export default App
