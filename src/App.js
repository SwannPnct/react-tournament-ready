import TournamentExact from './TournamentExact'

import './App.css';
import { useEffect, useState } from 'react';

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
  const [bracketData, setBracketData] = useState(null) //could be use only for backup and be differentiated from the old bracket data we want to load onto the component

  const [bracketDataToLoad, setBracketDataToLoad] = useState(null)

  const [lastScore, setLastScore] = useState(null)

  const handleGetMatchData = (data) => {
    setCurrentMatchData(data)
  }

  const handleGetBracketData = (data) => {
    if (!bracketData) {
      setBracketData(data)
    }
  }

  const handleSetUserScore = () => {
    setLastScore({
      score: 1
    })
  }

  const handleLoadBracketData = () => {
    setBracketDataToLoad(bracketData)
  }

  return (
    <div>
      <button onClick={handleSetUserScore}>user win</button>
      <button onClick={handleLoadBracketData}>load tournament</button>
      <TournamentExact 
        player={players[0]} //{name:... , id:...}
        players={players} //array of player objects, including user ('player')
        getMatchData={(data) => handleGetMatchData(data)} //current user match data
        insertScore = {lastScore} //{score} >> it has to be an object, even with 1 key
        getBracketData={(data) => handleGetBracketData(data)} //self-expl, is triggered every time the bracket changes
        loadBracketData={bracketDataToLoad} //useful to load an old bracket data or to re-open the tourney after the component got unmounted, players will be defined there too, no need to re-enter whole tourney players
      />
    </div>
  );
}

export default App;
