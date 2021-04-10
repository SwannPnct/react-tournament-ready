import React, { useEffect, useState } from 'react'
import './App.css'

import Game from './Game'

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

//class to create Match instances thorough the bracket
class Match  {
    constructor(roundNumber,matchNumber,id,players,score,isDone) { //player1 might be team1 too, using a teamID might be relevant as both will be concatenated to create the match id
        this.id = id ? id : null
        this.crd = [roundNumber,matchNumber]
        this.players = players ? players : [{name:null,id: null},{name:null,id: null}]
        this.score = score ? score : [null,null] //instances of Score, will be an array of scores in more complex tournament instances
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
            if (from % 2 === 0) {
                this.players[0] = player
            } else {
                this.players[1] = player
            }
        }
    }
    setScore(player1Score, player2Score, wholeBracket) {
        if (this.isDone) return

        this.score = [player1Score,player2Score]

        //if final game, dont send to next game
        if (this.crd[0] === wholeBracket.length - 1) return

        //sending to next match if score is full, in this use case, it always is after one game >> replacing sendToNextMatch()
        wholeBracket[this.crd[0]+1][Math.floor(this.crd[1]/2)].fillOnePlayer(player1Score > player2Score ? this.players[0] : this.players[1], this.crd[1]) // will have to make a copy of the bracket to use it as a parameter then only setting the bracket with the modified copy
        this.isDone = true
    }
    reset() {
        this.id = null
        this.players = [{name:null,id: null},{name:null,id: null}]
        this.score = [null,null] //instances of Score, will be an array of scores in more complex tournament instances
    }
}





//main component
const Tournament = (props) => {

    const [bracket, setBracket] = useState([])
    const [players,setPlayers] = useState([])

    useEffect(() => {

        if (props.loadBracketData) { // will be null for testing
            //retrieving the players data and order via the tournament 1st round
            let playersFromLoad = []

            //getting players from 1st round from game that have players only (filter method, could have been done with condition check in for each)
            props.loadBracketData[0].filter(match => match.players[0].id).forEach(match => playersFromLoad = playersFromLoad.concat(match.players)) // players wont get concatenated
            //getting players from 2nd round and verifying presence in playersFromLoad to avoid duplicate
            props.loadBracketData[1].forEach(match => match.players.forEach(player => {
                if (player.id && playersFromLoad.findIndex(loaded => loaded.id === player.id) === -1) playersFromLoad.push(player)
            }))

            setPlayers(playersFromLoad.map(e => {return {...e}}))

            //loading the bracket
            setBracket(copyBracket(props.loadBracketData))

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

        //filling matches with all remaining players
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

    useEffect(() => { // for sockets ?
        if (props.loadBracketData) {
            //retrieving the players data and order via the tournament 1st round
            let playersFromLoad = []

            //getting players from 1st round from game that have players only (filter method, could have been done with condition check in for each)
            props.loadBracketData[0].filter(match => match.players[0].id).forEach(match => playersFromLoad = playersFromLoad.concat(match.players)) // players wont get concatenated
            //getting players from 2nd round and verifying presence in playersFromLoad to avoid duplicate
            props.loadBracketData[1].forEach(match => match.players.forEach(player => {
                if (player.id && playersFromLoad.findIndex(loaded => loaded.id === player.id) === -1) playersFromLoad.push(player)
            }))

            setPlayers(playersFromLoad.map(e => {return {...e}}))

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
        const copy = [...bracket]
        copy[crd[0]][crd[1]].setScore(player1Score,player2Score,copy)
        setBracket(copy)
    }

    //sending match data to parent comp
    const handleSendMatchData = () => {
        props.getMatchData(handleFindMatchByPlayerID(props.player.id))
    }

    //sending bracket data to parent comp
    const handleSendBracketData = () => {
        props.getBracketData(copyBracket(bracket))
    }

    //sending clicked match data
    const handleSendClickedMatchData = (crd) => {
        props.onClickMatch(copyMatch(bracket[crd[0]][crd[1]]))
    }

    //inline styles
    //bracket inline style to create a dynamic height for the bracket
    const bracketStyle ={
        display: "flex",
        height: bracket[0] ? bracket[0].length * 100 + "px" : "800px",
        width: 230 * bracket.length + "px",
        overflow: "scroll"
    }

    const roundsStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent:"space-around",
        margin: "30px"
    }

    //rendering functions
    //handleSetScore prop is for testing only ( related to onclick event)
    const renderBracket = bracket.map((e,i) => (
        <div style={roundsStyle} key={i}>
            {e.map((f,j) => (
                <Game 
                    players={f.players} 
                    score = {f.score}
                    crd={[i,j]} 
                    handleSetScore={(crd,score1,score2) => handleSetScore(crd,score1,score2)}
                    key={i+j}
                    bracketHeight={bracketStyle.height}
                    bracketWidth={bracketStyle.width}
                    roundsMargin={roundsStyle.margin}
                    bracketLength={bracket.length}
                    handleClickOnMatchFromParent={(crd) => handleSendClickedMatchData(crd)}
                />
            ))}
        </div>
    ))
    
    return (
        <div style={bracketStyle}>
            {renderBracket}
        </div>
        
    )
}

export default Tournament