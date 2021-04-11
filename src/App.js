// App.js will not be present in the final product


import Tournament from './Tournament'

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
const players = randomPlayerDB(15)

function App() {

  const [currentMatchData, setCurrentMatchData] = useState(null)
  const [bracketData, setBracketData] = useState(null) //could be use only for backup and be differentiated from the old bracket data we want to load onto the component

  const [bracketDataToLoad, setBracketDataToLoad] = useState(null)

  const [playerIndex, setPlayerIndex] = useState(0)
  const [lastScore, setLastScore] = useState(null)

  const [playerName, setPlayerName] = useState(players[0].name)
  const [selectedPlayer, setSelectedPlayer] = useState(players[0])

  const [clickedMatch, setClickedMatch] = useState(null)

  const handleGetMatchData = (data) => {
    setCurrentMatchData(data)
  }

  const handleGetBracketData = (data) => {
    if (!bracketData) {
      setBracketData(data)
    }
  }

  const handleSetUserScore = () => {
    if (!selectedPlayer.id) return console.log("no user set")
    const randomScore = Math.floor(Math.random() * 100)
    setLastScore({
      score: randomScore
    })
  }

  const handleLoadBracketData = () => {
    setBracketDataToLoad(bracketData)
  }

  const handleSelectPlayer = () => {
    const foundPlayer = players.find(e => e.name === playerName)
    if (!foundPlayer) return console.log("no user found")
    setSelectedPlayer(foundPlayer)
  }

  return (
    <div>
      <input value={playerName} onChange={(e) => setPlayerName(e.target.value)}></input>
      <button onClick={handleSelectPlayer}>Confirm user</button>
      <button onClick={handleSetUserScore}>user random score</button>
      <button onClick={handleLoadBracketData}>load tournament</button>
      <Tournament 
        player={selectedPlayer} //{name:... , id:...}
        players={players} //array of player objects, including user ('player')
        getMatchData={(data) => handleGetMatchData(data)} //current user match data
        insertScore = {lastScore} //{score} >> it has to be an object, even with 1 key
        getBracketData={(data) => handleGetBracketData(data)} //self-expl, is triggered every time the bracket changes
        loadBracketData={bracketDataToLoad} //useful to load an old bracket data or to re-open the tourney after the component got unmounted, players will be defined there too, no need to re-enter whole tourney players
        onClickMatch={(data) => console.log(data)}
      />
    </div>
  );
}

export default App;
