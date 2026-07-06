import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import LocationDetailPage from "./pages/LocationDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lieux/:slug" element={<LocationDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;