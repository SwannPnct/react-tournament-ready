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
    }

    const players = [ // will be a props
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

    //pre-initializing rounds
    const bracket = []
    for (let i = 0; i < countRounds; i++) {
        bracket.push([])
    }
    
    //filling 1st round with Match instances
    players.forEach((e,idx) => {
        if (idx % 2 === 0) { 
            bracket[0].push(new Match(e,players[idx + 1],0,e + players[idx + 1]))
        }
    })

    return (
        <div>
            Hello
        </div>
    )
}

export default TournamentExact