import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WeatherPage } from './pages/WeatherPage';
import { EconomyPage } from './pages/EconomyPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WeatherPage />} />
        <Route path="/economia" element={<EconomyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
