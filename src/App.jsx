import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./components/Home"
import Paste from "./components/Paste"
import ViewPaste from "./components/ViewPaste"
import Navbar from "./components/Navbar"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#020617]">
          <Navbar />
          <div className="w-full flex-1 flex justify-center items-start">
            <Home />
          </div>
        </div>
      )
    },
    {
      path: "/pastes",
      element: (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#020617]">
          <Navbar />
          <div className="w-full flex-1 flex justify-center items-start">
            <Paste />
          </div>
        </div>
      )
    },
    {
      path: "/pastes/:id",
      element: (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#020617]">
          <Navbar />
          <div className="w-full flex-1 flex justify-center items-start">
            <ViewPaste />
          </div>
        </div>
      )
    }
  ]
)

function App() {
  return <RouterProvider router={router} />
}

export default App
