import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Grade } from './pages/Grade';
import { About } from './pages/About';
import { ComplementaryActivities } from './pages/ComplementaryActivities';
import './App.css';

function App() {
  return (
    <BrowserRouter basename="/flowchart">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grade" element={<Grade />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/atividades-complementares" element={<ComplementaryActivities />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;