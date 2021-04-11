import React, { useEffect, useState } from 'react'
import './App.css'

//sub component
import Game from './Game'

//class generating match instances
import Match from './Match'

//helpers
import {copyBracket,copyMatch,shuffleArray} from './helpers'


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
        //sending current user match data ( deep copy)
        props.getMatchData(handleFindMatchByPlayerID(props.player.id))

        //sending bracket data ( deep copy)
        props.getBracketData(copyBracket(bracket))

    },[bracket])

    useEffect(() => {
        if (!props.insertScore) return
        const {score} = props.insertScore

        const bracketCopy = copyBracket(bracket)

        //getting deep copy of the match, to find match crd and use it in bracket copy
        const match = handleFindMatchByPlayerID(props.player.id)

        bracketCopy[match.crd[0]][match.crd[1]].setScoreByPlayerID(props.player.id,score,bracketCopy)

        console.log(bracketCopy)

        setBracket(bracketCopy)

    },[props.insertScore])

    //helper to find match with player id > might be ext out of component in a helper file
    const handleFindMatchByPlayerID = (playerID) => {
        //this should work with a reversed bracket, not a normal order one, i really dont get it, but well, it works
        let matchFound = null
        bracket.forEach((e) => {
            e.forEach(match => {
                if (match.players.findIndex(player => player.id === playerID) !== -1) return matchFound = match
            })
        })
        return copyMatch(matchFound)
    }

    //helper to get the instance of the match ( better to access its method as it's not a deep copy)
    //NOT USED FOR NOW
    const handleFindMatchInstanceByPlayerID = (playerID) => {
        let matchFound = null
        bracket.forEach((e) => {
            e.forEach(match => {
                if (match.players.findIndex(player => player.id === playerID) !== -1) return matchFound = match
            })
        })
        return matchFound
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
                    playerID={props.player.id}
                    players={f.players} 
                    score = {f.score}
                    crd={[i,j]} 
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