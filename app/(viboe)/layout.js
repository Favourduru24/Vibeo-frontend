import Slider from "@/components/Slider"
import Header from "@/components/Header"
import Session from "@/components/Session"

const RootLayout = ({ children }) => {
  return (
    <Session>
       <main className="flex flex-col max-w-[1680px] mx-auto h-screen overflow-hidden">
       {/* Fixed Header */}
        <Header className="fixed top-0 left-0 right-0 z-50" />
      
       <div className="flex pt-14 h-full"> {/* pt-14 matches header height */}
        {/* Fixed Sidebar */}
        <div className="fixed left-0 top-14 bottom-0 w-68">
          <Slider />
        </div>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 lg:ml-68 overflow-y-auto">
          <div className="max-w-[1350px] mx-auto w-full text-dark-400">

            {children}
          </div>
        </div>
       </div>
      </main>
    </Session>
  )
}

export default RootLayout