import Match from './Match'

//array shuffle helper
const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

 //multi dimensional array deep copy helper
 const copyBracket = (bracket) => {
    const copy = []
    bracket.forEach((round,idx) => {
        copy.push([])
        round.forEach((match,idx2) => {
            const {players,id,score,isDone} = match
            const playersCopy = players.map(player => {return {...player}})
            copy[idx].push(new Match(idx,idx2,id,playersCopy,[...score],isDone))
        })
    })
    return copy
}

//copy a match
const copyMatch = (match) => {
    const {players,id,crd,score,isDone} = match
    const playersCopy = players.map(player => {return {...player}})
    return new Match(crd[0],crd[1],id,playersCopy,[...score],isDone)
}

export {shuffleArray,copyBracket,copyMatch}