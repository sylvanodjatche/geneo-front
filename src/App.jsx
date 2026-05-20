// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import History from './pages/History';
import { useTheme } from './context/ThemeContext';
import './index.css';

function App() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <Router>
      <div className="app-container">
        <nav className="bg-gray-800 p-4 rounded-lg mb-6 shadow-md flex items-center">
          <Link to="/" className="text-white mr-6 hover:text-gray-300 transition">Accueil</Link>
          <Link to="/history" className="text-white mr-6 hover:text-gray-300 transition">Historique</Link>
          <Link to="/about" className="text-white mr-6 hover:text-gray-300 transition">À propos</Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-auto text-white bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition"
          >
            {darkMode ? '☀️ Clair' : '🌙 Sombre'}
          </button>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;