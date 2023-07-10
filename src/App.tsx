import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './Designer/components/Home';
import { CommandsList } from './Designer/components/CommandList';

const App: React.FC = () => {
  return (
    <div className="rootContainer">
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/commands" Component={CommandsList} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
