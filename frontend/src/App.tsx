import React from 'react';
import './App.css';
import TopBar from './components/TopBar/TopBar';
import MainContent from './components/MainContent/MainContent';

function App() {
  return (
    <div className="app">
      <TopBar />
      <MainContent />
    </div>
  );
}

export default App;
