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
    fillOnePlayer(player,from) {
        if (!from) {
            this.players[this.players.findIndex(e => !e.id)] = player // for now we'll just fill the player position by order of receiving ( 1st player to go forward we'll be in the upper position)
        if (this.players.findIndex(e => !e.id) === -1) this.id = this.players[0].id + this.players[1].id
        } else {
            // here the handling to place player on upper or lower of the new game
        }
    }
    setScore(player1Score, player2Score, wholeBracket) {
        if (this.isDone) return

        this.score = [player1Score,player2Score]
        //sending to next match if score is full, in this use case, it always is after one game >> replacing sendToNextMatch()
        wholeBracket[this.crd[0]+1][Math.floor(this.crd[1]/2)].fillOnePlayer(player1Score > player2Score ? this.players[0] : this.players[1]) // will have to make a copy of the bracket to use it as a parameter then only setting the bracket with the modified copy
        this.isDone = true
    }
    reset() {
        this.id = null
        this.players = [{name:null,id: null},{name:null,id: null}]
        this.score = null //instances of Score, will be an array of scores in more complex tournament instances
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
const Tournament = (props) => {

    const [bracket, setBracket] = useState([])
    const [players,setPlayers] = useState([])

    //winning overlay, will be a facultative bool on comp props, user can also extract bracket data and decide action on winning game
    const [winnerOverlay, setWinnerOverlay] = useState(false)
    const [winner, setWinner] = useState("")

    useEffect(() => {

        if (props.loadBracketData) { // will be null for testing

            //retrieving the players data and order via the tournament 1st round
            const playerFromLoad = []
            props.loadBracketData[0].forEach(e => playerFromLoad.concat(e.players.map(player => {return {...player}}))) // this wont work for complex bracket
            setPlayers(playerFromLoad)

            //loading the bracket
            setBracket(props.loadBracketData)

            return
        }

        const copyPlayers = props.players.map(e => {return {...e}})
        shuffleArray(copyPlayers)
        setPlayers(copyPlayers)

        const newBracket = []
        
        //counting rounds, we need to find the closest number to 2 power something
        let rounds = 0
        let countPlayers = copyPlayers.length

        while (Math.pow(2,rounds) < countPlayers) {
            rounds++
        }

        //creating bracket with empty match instance, 1st round (which will have not all matches use, will still be filled entirely with match instances)
        //pre-initializing rounds and empty matches instances
        let length = Math.pow(2,rounds)
        for (let i = 0; i < rounds; i++) {
            newBracket.push([])
            for (let j = 0; j < length / 2; j++) {
                newBracket[i].push(new Match(i,j))
            }
            length = length / 2
        }

        //filling randomly 1st rounds with 1 player
        //then filling randomly second player
        //then advancing only the players that are alone in a match
        // in 1st round, clearing the match with 1 player only by replacing them by empty match instances (necessary for a better UI)

        //fill match of 1st round with 1 player only
        const playerDBCopy = copyPlayers.map(e => {return {...e}})
        for (let k = 0; k < newBracket[0].length; k++) {
            newBracket[0][k].fillOnePlayer({...playerDBCopy[0]})
            playerDBCopy.shift()
        }

        //filling the games randomly with another player until the remaining players to place are equal to the double of the match filled with 1 player in the 2nd round
        const matchToPickFrom = []
        for (let j = 0; j < newBracket[0].length; j++) {
            matchToPickFrom.push(j)
        }
        shuffleArray(matchToPickFrom)
        let iterator = 0
        while (playerDBCopy.length !== 0) {
            newBracket[0][matchToPickFrom[iterator]].fillOnePlayer({...playerDBCopy[0]})
            playerDBCopy.shift()
            iterator++
        }

        //advancing players alone in match in next round and replacing match instances in 1st round with only 1 player with empty match instances
        newBracket[0].filter(match => match.players.find(player => !player.id)).forEach(match => {
            match.setScore(1,0,newBracket)
            match.reset()
        })

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

export default Tournament