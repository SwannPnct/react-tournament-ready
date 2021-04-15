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
};

export { shuffleArray, copyBracket, copyMatch };