import React from 'react';
import logo from './logo.svg';
import './App.css';
import ConnectAccount from './components/ConnectAccount';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h4>Meeting Manager</h4>
      </header>
      <ConnectAccount />
    </div>
  );
}

export default App;
