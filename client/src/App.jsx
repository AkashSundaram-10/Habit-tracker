import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Reminders from './pages/Reminders';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
