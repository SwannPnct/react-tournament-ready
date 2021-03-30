import TournamentExact from './TournamentExact'

import './App.css';

//helper to create a player DB > for development only
const randomPlayerDB = (count) => {
  const players = []
  for (let i = 0; i < count; i++) {
    let id = ""
    for (let j = 0;j< 5;j++) {
      id += Math.floor(Math.random() * 10)
    }
    players.push(id)
  }
  return players
}

function App() {

  return (
    <div>
      <TournamentExact players={randomPlayerDB(32)}/>
    </div>
  );
}

export default App;
