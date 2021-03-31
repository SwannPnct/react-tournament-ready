import TournamentExact from './TournamentExact'

import './App.css';

//helper to create a player DB > for development only
const randomPlayerDB = (count) => {
  const base = []
  for (let i = 0; i < count; i++) {
    let id = ""
    for (let j = 0;j< 5;j++) {
      id += Math.floor(Math.random() * 10)
    }
    base.push({name: "player"+id,id})
  }
  return base
}
const players = randomPlayerDB(8)

function App() {

  return (
    <div>
      <TournamentExact player={players[0]} players={players}/>
    </div>
  );
}

export default App;
