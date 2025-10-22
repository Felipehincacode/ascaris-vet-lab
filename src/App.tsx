import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "@/context/GlobalContext";
import { Header } from "@/components/Header";
import { VideoModal } from "@/components/VideoModal";
import Inicio from "./pages/Inicio";
import Podcast from "./pages/Podcast";
import IA from "./pages/IA";
import Test from "./pages/Test";
import Galeria from "./pages/Galeria";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GlobalProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <main>
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/podcast" element={<Podcast />} />
                <Route path="/ia" element={<IA />} />
                <Route path="/test" element={<Test />} />
                <Route path="/galeria" element={<Galeria />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <VideoModal />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </GlobalProvider>
  </QueryClientProvider>
);

export default App;
