import React from 'react'

//we'll assume we'll have only necessary players for now (8 players as a starter)
//other possibilities 2,4,8,16,32,64...

//array shuffle helper
const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//main component
const TournamentExact = (props) => {

    class Match  {
        constructor(roundNumber,matchNumber) { //player1 might be team1 too, using a teamID might be relevant as both will be concatenated to create the match id
            this.id = undefined
            this.crd = [roundNumber,matchNumber]
            this.players = [undefined,undefined]
            this.score = null //instances of Score, will be an array of scores in more complex tournament instances
        }
        fillPlayers(playersList) {
            this.players = [playersList[0],playersList[1]]
            this.id = playersList[0]+playersList[1]
        }
        receiveOnePlayer(player) {
            this.players[this.players.findIndex(e => !e)] = player // for now we'll just fill the player position by order of receiving ( 1st player to go forward we'll be in the upper position)
            if (this.players.findIndex(e => !e) === -1) this.id = this.players[0] + this.players[1]
        }
        setScore(player1Score, player2Score) {
            this.score = [player1Score,player2Score]
            sendToNextMatch(this.crd)
        }
    }

    const players = [ // will be a prop
        "playera",
        "playerb",
        "playerc",
        "playerd",
        "playere",
        "playerf",
        "playerg",
        "playerh"
    ]  

    shuffleArray(players)

    //counting how may max rounds we have in the tourney
    let countRounds = 0
    let length = players.length
    do {
        countRounds++
        length = length / 2
    } while (length >= 2)

    //pre-initializing rounds and empty matches instances
    const bracket = []
    length = players.length
    for (let i = 0; i < countRounds; i++) {
        bracket.push([])
        for (let j = 0; j < length / 2; j++) {
            bracket[i].push(new Match(i,j))
        }
        length = length / 2
    }

    //filling 1st round with players
    for (let k = 0; k < players.length; k += 2) {
        bracket[0][k/2].fillPlayers([players[k], players[k+1]])
    }

    console.log("INITIAL BRACKET")
    console.log(bracket)

    //bracket navigation helper
    const sendToNextMatch = (currentMatchCrd) => {
        const match = bracket[currentMatchCrd[0]][currentMatchCrd[1]]
        const winningPlayerIndex = match.score.findIndex(e => e === Math.max(...match.score))
        bracket[currentMatchCrd[0]+1][Math.floor(currentMatchCrd[1]/2)].receiveOnePlayer(match.players[winningPlayerIndex])
    }

    return (
        <div>
            Hello
        </div>
    )
}

export default TournamentExact