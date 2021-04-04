import React, { useEffect, useState } from 'react'
import './App.css'

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

 //multi dimensional array deep copy helper
 const copyBracket = (bracket) => {
    const copy = []
    bracket.forEach((round,idx) => {
        copy.push([])
        round.forEach((match,idx2) => {
            const {players,id,score,isDone} = match
            const playersCopy = players.map(player => {return {...player}})
            copy[idx].push(new Match(idx,idx2,id,playersCopy,score ? [...score] : null,isDone))
        })
    })
    return copy
}

//class to create Match instances thorough the bracket
class Match  {
    constructor(roundNumber,matchNumber,id,players,score,isDone) { //player1 might be team1 too, using a teamID might be relevant as both will be concatenated to create the match id
        this.id = id ? id : null
        this.crd = [roundNumber,matchNumber]
        this.players = players ? players : [{name:null,id: null},{name:null,id: null}]
        this.score = score ? score : null //instances of Score, will be an array of scores in more complex tournament instances
        this.isDone = isDone
    }
    fillPlayers(playersList) {
        this.players = [playersList[0],playersList[1]]
        this.id = playersList[0].id+playersList[1].id
    }
    receiveOnePlayer(player) {
        this.players[this.players.findIndex(e => !e.id)] = player // for now we'll just fill the player position by order of receiving ( 1st player to go forward we'll be in the upper position)
        if (this.players.findIndex(e => !e.id) === -1) this.id = this.players[0].id + this.players[1].id
    }
    setScore(player1Score, player2Score, wholeBracket) {
        if (this.isDone) return

        this.score = [player1Score,player2Score]
        //sending to next match if score is full, in this use case, it always is after one game >> replacing sendToNextMatch()
        wholeBracket[this.crd[0]+1][Math.floor(this.crd[1]/2)].receiveOnePlayer(player1Score > player2Score ? this.players[0] : this.players[1]) // will have to make a copy of the bracket to use it as a parameter then only setting the bracket with the modified copy
        this.isDone = true
    }
}

//subcomponent
const Game = (props) => {
    return (
        <div className="games">
            <div onClick={() => props.handleSetScore(props.crd,1,0)}>{props.player1 ? props.player1.name : "TDB"}</div>
            <div onClick={() => props.handleSetScore(props.crd,0,1)}>{props.player2 ? props.player2.name : "TBD"}</div>
        </div>
    )
}

const WinnerOverlay = (props) => {
    return (
        <div className="winnerOverlay">
            Winner is {props.winner}
            <br></br>
            <button onClick={props.onOkay}>Okay</button>
        </div>
    )
}

//main component
const TournamentExact = (props) => {

    const [bracket, setBracket] = useState([])
    const [players,setPlayers] = useState([])

    //winning overlay, will be a facultative bool on comp props, user can also extract bracket data and decide action on winning game
    const [winnerOverlay, setWinnerOverlay] = useState(false)
    const [winner, setWinner] = useState("")

    useEffect(() => {

        if (props.loadBracketData) { // will be null for testing

            //retrieving the players data and order via the tournament 1st round
            const playerFromLoad = []
            props.loadBracketData[0].forEach(e => playerFromLoad.concat(e.players.map(player => {return {...player}})))
            setPlayers(playerFromLoad)

            //loading the bracket
            setBracket(props.loadBracketData)

            return
        }

        const copyPlayers = props.players
        shuffleArray(copyPlayers)
        setPlayers(copyPlayers)

        const newBracket = []
        //counting how may max rounds we have in the tourney
        let countRounds = 0
        let length = copyPlayers.length
        do {
            countRounds++
            length = length / 2
        } while (length >= 2)

        //pre-initializing rounds and empty matches instances
        length = copyPlayers.length
        for (let i = 0; i < countRounds; i++) {
            newBracket.push([])
            for (let j = 0; j < length / 2; j++) {
                newBracket[i].push(new Match(i,j))
            }
            length = length / 2
        }

        //filling 1st round with players
        for (let k = 0; k < copyPlayers.length; k += 2) {
            newBracket[0][k/2].fillPlayers([copyPlayers[k], copyPlayers[k+1]])
        }
        setBracket(newBracket)
    },[])

    useEffect(() => { // FOR TESTING ONLY, loadBracketData shall be used on comp mounting only
        if (props.loadBracketData) {
            //retrieving the players data and order via the tournament 1st round
            const playerFromLoad = []
            props.loadBracketData[0].forEach(e => playerFromLoad.concat(e.players.map(player => {return {...player}})))
            setPlayers(playerFromLoad)

            //loading the bracket
            setBracket(copyBracket(props.loadBracketData))
        }
    },[props.loadBracketData])

    useEffect(() => {
        if (bracket.length === 0) return
        handleSendMatchData()
        handleSendBracketData()
    },[bracket])

    useEffect(() => {
        if (!props.insertScore) return
        const {score} = props.insertScore
        const match = handleFindMatchByPlayerID(props.player.id)
        const playerIndex = match.players.findIndex(e => e.id === props.player.id)
        playerIndex === 0 ? handleSetScore([...match.crd],score,0) : handleSetScore([...match.crd],0,score)
    },[props.insertScore])

    //helper to find match with player id > might be ext out of component in a helper file
    const handleFindMatchByPlayerID = (playerID) => {
        //this should work with a reversed bracket, not a normal order one, i really dont get it, but well, it works
        let matchData = null
        bracket.forEach((e) => {
            e.forEach(f => {
                if (f.players.findIndex(j => j.id === playerID) !== -1) return matchData = f
            })
        })
        return {...matchData}
    }

    //setting score on both side of the game >> will be completed by a checking when both players are entering a score
    const handleSetScore = (crd,player1Score,player2Score) => { // in v2, setScore will use the player id
        if (crd[0] === bracket.length - 1) {
            setWinnerOverlay(true)
            setWinner(bracket[crd[0]][crd[1]].players[player1Score > player2Score ? 0 : 1].name)
            return
        }
        const copy = [...bracket]
        copy[crd[0]][crd[1]].setScore(player1Score,player2Score,copy)
        setBracket(copy)
    }

    //hiding winner overlay, might add other func to reset bracket or send an info to parent comp
    const handleOkayOverlay = () => {
        setWinnerOverlay(false)
    }

    //sending match data to parent comp
    const handleSendMatchData = () => {
        props.getMatchData(handleFindMatchByPlayerID(props.player.id))
    }

    //sending bracket data to parent comp
    const handleSendBracketData = () => {
        props.getBracketData(copyBracket(bracket))
    }

    //rendering functions
    const renderBracket = bracket.map((e,i) => (
        <div className="rounds" key={i}>
            {e.map((f,j) => (
                <Game 
                    player1={f.players[0]} 
                    player2={f.players[1]} 
                    crd={[i,j]} 
                    handleSetScore={(crd,score1,score2) => handleSetScore(crd,score1,score2)}
                    key={i+j}
                />
            ))}
        </div>
    ))
    

    return (
        <div className="bracket">
            {renderBracket}
            { winnerOverlay ? <WinnerOverlay onOkay={handleOkayOverlay} winner={winner}/> : null}
        </div>
        
    )
}

export default TournamentExact