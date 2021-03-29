import React from 'react'

//we'll assume we'll have only necessary players for now (8 players as a starter)
//other possibilities 2,4,8,16,32,64...

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const TournamentExact = (props) => {

    class Score {
        constructor(player1, player1Score,player2, player2Score) {
            this.data = {
                players: [player1,player2],
                points: [player1Score,player2Score]
            }
        }
    }

    class Match  {
        constructor(player1, player2, round, id) { //player1 might be team1 too
            this.id = id
            this.players = [player1,player2]
            this.round = round
            this.scores = [] //array of instances of Score
        }
        fillPlayers(player1, player2) {
            this.players = [player1,player2]
            this.id = player1+player2
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
            bracket[i].push(new Match(undefined,undefined,i,undefined))
        }
        length = length / 2
    }

    //filling 1st round with players
    for (let k = 0; k < players.length; k += 2) {
        bracket[0][k/2].fillPlayers(players[k], players[k+1])
    }

    console.log(bracket)

    return (
        <div>
            Hello
        </div>
    )
}

export default TournamentExact