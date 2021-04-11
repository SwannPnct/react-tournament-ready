//class to create Match instances thorough the bracket
class Match  {
    constructor(roundNumber,matchNumber,id,players,score,isDone) {
        this.id = id ? id : null
        this.crd = [roundNumber,matchNumber]
        this.players = players ? players : [{name:null,id: null},{name:null,id: null}] // empty object with null values to avoid an undefined key
        this.score = score ? score : [null,null]
        this.isDone = isDone
    }
    fillPlayers(playersList) {
        this.players = [playersList[0],playersList[1]]
        this.id = playersList[0].id+playersList[1].id
    }
    fillOnePlayer(player,from) {
        if (!from) {
            //filling from the top of the game, only used while the bracket is issuing 1st process of generation
            this.players[this.players.findIndex(e => !e.id)] = player
            if (this.players.findIndex(e => !e.id) === -1) this.id = this.players[0].id + this.players[1].id
        } else {
            //filling the player depending from where he comes (top or bottom / home or outsider)
            if (from % 2 === 0) {
                this.players[0] = player
                if (this.players.findIndex(e => !e.id) === -1) this.id = this.players[0].id + this.players[1].id
            } else {
                this.players[1] = player
                if (this.players.findIndex(e => !e.id) === -1) this.id = this.players[0].id + this.players[1].id
            }
        }
    }
    setScore(player1Score, player2Score, wholeBracket) { // shall be used only during bracket generation
        this.score = [player1Score,player2Score]
        this.isDone = true

        //sending to next match after score filling
        wholeBracket[this.crd[0]+1][Math.floor(this.crd[1]/2)].fillOnePlayer(player1Score > player2Score ? this.players[0] : this.players[1], this.crd[1]) // will have to make a copy of the bracket to use it as a parameter then only setting the bracket with the modified copy
    }
    setScoreByPlayerID(playerID, playerScore, wholeBracket) { //new version of score settings > each players input their score and game advance only when both score are registered
        if (this.isDone) return
        if (!this.players[0].id || !this.players[1].id) return

        //finding the player and setting its related score
        const index = this.players.findIndex(e => e.id === playerID)
        this.score[index] = playerScore

        if (this.score[0] && this.score[1]) {
            this.isDone = true

            //if final game, dont send to next game
            if (this.crd[0] === wholeBracket.length - 1) return

            wholeBracket[this.crd[0]+1][Math.floor(this.crd[1]/2)].fillOnePlayer(this.score[0] > this.score[1] ? this.players[0] : this.players[1], this.crd[1])
        }
    }
    reset() {
        this.id = null
        this.players = [{name:null,id: null},{name:null,id: null}]
        this.score = [null,null]
    }
}

export default Match