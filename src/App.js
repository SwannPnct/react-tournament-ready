// App.js will not be present in the final product


import Tournament from './Tournament'

import './App.css';
import { useState } from 'react';

//helper to create a team DB > for development only
const randomTeamDB = (count) => {
  const base = []
  for (let i = 0; i < count; i++) {
    let id = ""
    for (let j = 0;j< 5;j++) {
      id += Math.floor(Math.random() * 10)
    }
    base.push({name: "team"+id,id})
  }
  return base
}
const teams = randomTeamDB(15)

function App() {

  const [currentMatchData, setCurrentMatchData] = useState(null)
  const [bracketData, setBracketData] = useState(null) //could be use only for backup and be differentiated from the old bracket data we want to load onto the component

  const [bracketDataToLoad, setBracketDataToLoad] = useState(null)

  const [teamIndex, setTeamIndex] = useState(0)
  const [lastScore, setLastScore] = useState(null)

  const [teamName, setTeamName] = useState(teams[0].name)
  const [selectedTeam, setSelectedTeam] = useState(teams[0])

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
    if (!selectedTeam.id) return console.log("no user set")
    const randomScore = Math.floor(Math.random() * 100)
    setLastScore({
      score: randomScore
    })
  }

  const handleLoadBracketData = () => {
    setBracketDataToLoad(bracketData)
  }

  const handleSelectTeam = () => {
    const foundTeam = teams.find(e => e.name === teamName)
    if (!foundTeam) return console.log("no team found")
    setSelectedTeam(foundTeam)
  }

  return (
    <div>
      <input value={teamName} onChange={(e) => setTeamName(e.target.value)}></input>
      <button onClick={handleSelectTeam}>Confirm team</button>
      <button onClick={handleSetUserScore}>user random score</button>
      <button onClick={handleLoadBracketData}>load tournament</button>
      <Tournament 
        team={selectedTeam} //{name:... , id:...}
        teams={teams} //array of team objects, including user ('team')
        getMatchData={(data) => handleGetMatchData(data)} //current user match data
        insertScore = {lastScore} //{score} >> it has to be an object, even with 1 key
        getBracketData={(data) => handleGetBracketData(data)} //self-expl, is triggered every time the bracket changes
        loadBracketData={bracketDataToLoad} //useful to load an old bracket data or to re-open the tourney after the component got unmounted, teams will be defined there too, no need to re-enter whole tourney teams
        onClickMatch={(data) => console.log(data)}
      />
    </div>
  );
}

export default App;
