import TournamentExact from './TournamentExact'

import './App.css';
import { useState } from 'react';

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

  const [currentMatchData, setCurrentMatchData] = useState(null)
  const [bracketData, setBracketData] = useState(null)
  const [lastScore, setLastScore] = useState(null)

  const handleGetMatchData = (data) => {
    setCurrentMatchData(data)
  }

  const handleGetBracketData = (data) => {
    setBracketData(data)
    console.log("data")
    console.log(data)
  }

  const handleSetUserScore = () => {
    setLastScore({
      score: 1
    })
  }

  return (
    <div>
      <button onClick={handleSetUserScore}>Player win</button>
      <TournamentExact 
        player={players[0]} //{name:... , id:...}
        players={players} //array of player objects, including user ('player')
        getMatchData={(data) => handleGetMatchData(data)} //current matchID of user
        insertScore = {lastScore} //{score} >> it has to be an object, even with 1 key
        getBracketData={(data) => handleGetBracketData(data)} //self-expl, use to backup the bracket data or to share via sockets
      />
    </div>
  );
}

export default App;
