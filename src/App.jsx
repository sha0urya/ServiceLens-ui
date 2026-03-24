import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AskPage from './pages/AskPage';
import IngestPage from './pages/IngestPage';
import ExplorePage from './pages/ExplorePage';
import ServicesPage from './pages/ServicesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<AskPage />} />
          <Route path="ingest" element={<IngestPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="explore" element={<ExplorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
