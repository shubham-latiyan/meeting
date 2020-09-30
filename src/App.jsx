import React, { useEffect, useState } from 'react';
import './App.css';
import ConnectAccount from './components/ConnectAccount';
const axios = require('axios');

function App() {

  useEffect(() => {
    if (localStorage.getItem('userId') == null) {
      setId(false)
    }
    else {
      setId(true)
    }
  }, [])

  const [email, setEmail] = useState("");
  const [id, setId] = useState(false);
  function logout() {
    localStorage.removeItem('userId');
    window.location.reload();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h4>Meeting Manager</h4>
      </header>
      <button className="logout" onClick={logout}>Log Out</button>
      {!id &&
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span>
            Enter your email
        </span>
        &nbsp;
        &nbsp;
        <input type="text" onChange={text => setEmail(text.target.value)} />
        &nbsp;
        &nbsp;
          <button onClick={async () => {
            let url = "http://52.74.133.214:6388/getId"
            let res = await axios.post(url, {
              email: email
            });
            console.log('res.data.data:', res.data.data)
            localStorage.setItem('userId', res.data.data.userId);
            localStorage.setItem('userObj', JSON.stringify(res.data.data));
            setId(true)
          }}>Proceed</button>
        </div>
      }
      {id && <ConnectAccount userObj={JSON.parse(localStorage.getItem('userObj'))} />}
    </div>
  );
}

export default App;
