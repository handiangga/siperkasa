import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import DetailPerkara from "./pages/DetailPerkara";
import JaksaPage from "./pages/JaksaPage";
import SpdpPage from "./pages/SpdpPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perkara/:id" element={<DetailPerkara />} />
        <Route path="/jaksas" element={<JaksaPage />} />
        <Route path="/spdps" element={<SpdpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
