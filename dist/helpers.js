import Match from './Match'; //array shuffle helper

const shuffleArray = array => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}; //multi dimensional array deep copy helper


const copyBracket = bracket => {
  const copy = [];
  bracket.forEach((round, idx) => {
    copy.push([]);
    round.forEach((match, idx2) => {
      const {
        teams,
        id,
        score,
        isDone
      } = match;
      const teamsCopy = teams.map(team => {
        return { ...team
        };
      });
      copy[idx].push(new Match(idx, idx2, id, teamsCopy, [...score], isDone));
    });
  });
  return copy;
}; //copy a match


const copyMatch = match => {
  const {
    teams,
    id,
    crd,
    score,
    isDone
  } = match;
  const teamsCopy = teams.map(team => {
    return { ...team
    };
  });
  return new Match(crd[0], crd[1], id, teamsCopy, [...score], isDone);
}; //create a bracket from user list > helper for backend, already included in the Tournament hook at mounting


const createBracket = teams => {
  const copyTeams = teams.map(e => {
    return { ...e
    };
  });
  shuffleArray(copyTeams);
  const newBracket = []; //counting rounds, we need to find the closest number to 2 power something

  let rounds = 0;
  let countTeams = copyTeams.length;

  while (Math.pow(2, rounds) < countTeams) {
    rounds++;
  }

  let length = Math.pow(2, rounds);

  for (let i = 0; i < rounds; i++) {
    newBracket.push([]);

    for (let j = 0; j < length / 2; j++) {
      newBracket[i].push(new Match(i, j));
    }

    length = length / 2;
  } //fill match of 1st round with 1 team only


  const teamDBCopy = copyTeams.map(e => {
    return { ...e
    };
  });

  for (let k = 0; k < newBracket[0].length; k++) {
    newBracket[0][k].fillOneTeam({ ...teamDBCopy[0]
    });
    teamDBCopy.shift();
  } //filling matches with all remaining teams


  const matchToPickFrom = [];

  for (let j = 0; j < newBracket[0].length; j++) {
    matchToPickFrom.push(j);
  }

  shuffleArray(matchToPickFrom);
  let iterator = 0;

  while (teamDBCopy.length !== 0) {
    newBracket[0][matchToPickFrom[iterator]].fillOneTeam({ ...teamDBCopy[0]
    });
    teamDBCopy.shift();
    iterator++;
  } //advancing teams alone in match in next round and replacing match instances in 1st round with only 1 team with empty match instances


  newBracket[0].filter(match => match.teams.find(team => !team.id)).forEach(match => {
    match.setScore(1, 0, newBracket);
    match.reset();
  });
  return copyBracket(newBracket);
};

const extractTeams = bracket => {
  //retrieving the teams data and order via the tournament 1st round
  let teamsFromLoad = []; //getting teams from 1st round from game that have teams only (filter method, could have been done with condition check in for each)

  bracket[0].filter(match => match.teams[0].id).forEach(match => teamsFromLoad = teamsFromLoad.concat(match.teams)); // teams wont get concatenated
  //getting teams from 2nd round and verifying presence in teamsFromLoad to avoid duplicate

  bracket[1].forEach(match => match.teams.forEach(team => {
    if (team.id && teamsFromLoad.findIndex(loaded => loaded.id === team.id) === -1) teamsFromLoad.push(team);
  })); //returning copy

  return teamsFromLoad.map(e => {
    return { ...e
    };
  });
};

export { shuffleArray, copyBracket, copyMatch, createBracket, extractTeams };