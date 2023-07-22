import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './Designer/components/Home';
import { CommandsList } from './Designer/components/CommandList';
import { FinaliseSchematic } from './Designer/components/FinaliseSchematic';

const App: React.FC = () => (
  <div className="rootContainer">
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/commands" Component={CommandsList} />
        <Route path="/finalise" Component={FinaliseSchematic} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
