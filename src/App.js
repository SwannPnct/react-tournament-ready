import TournamentExact from './TournamentExact'

import './App.css';


function App() {

  const players = [
    "playera",
    "playerb",
    "playerc",
    "playerd",
    "playere",
    "playerf",
    "playerg",
    "playerh"
  ]

  return (
    <div>
      <TournamentExact players={players}/>
    </div>
  );
}

export default App;
