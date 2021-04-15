//class to create Match instances thorough the bracket
class Match {
  constructor(roundNumber, matchNumber, id, teams, score, isDone) {
    this.id = id ? id : null;
    this.crd = [roundNumber, matchNumber];
    this.teams = teams ? teams : [{
      name: null,
      id: null
    }, {
      name: null,
      id: null
    }]; // empty object with null values to avoid an undefined key

    this.score = score ? score : [null, null];
    this.isDone = isDone;
  }

  fillOneTeam(team, from) {
    if (!from) {
      //filling from the top of the game, only used while the bracket is issuing 1st process of generation
      this.teams[this.teams.findIndex(t => !t.id)] = team;
      if (this.teams.findIndex(t => !t.id) === -1) this.id = this.teams[0].id + this.teams[1].id;
    } else {
      //filling the team depending from where he comes (top or bottom / home or outsider)
      if (from % 2 === 0) {
        this.teams[0] = team;
        if (this.teams.findIndex(t => !t.id) === -1) this.id = this.teams[0].id + this.teams[1].id;
      } else {
        this.teams[1] = team;
        if (this.teams.findIndex(t => !t.id) === -1) this.id = this.teams[0].id + this.teams[1].id;
      }
    }
  }

  setScore(team1Score, team2Score, wholeBracket) {
    // shall be used only during bracket generation
    this.score = [team1Score, team2Score];
    this.isDone = true; //sending to next match after score filling

    wholeBracket[this.crd[0] + 1][Math.floor(this.crd[1] / 2)].fillOneTeam(team1Score > team2Score ? this.teams[0] : this.teams[1], this.crd[1]); // will have to make a copy of the bracket to use it as a parameter then only setting the bracket with the modified copy
  }

  setScoreByTeamID(teamID, teamScore, wholeBracket) {
    //new version of score settings > each teams input their score and game advance only when both score are registered
    if (this.isDone) return;
    if (!this.teams[0].id || !this.teams[1].id) return; //finding the team and setting its related score

    const index = this.teams.findIndex(e => e.id === teamID);
    this.score[index] = teamScore;

    if (this.score[0] && this.score[1]) {
      this.isDone = true; //if final game, dont send to next game

      if (this.crd[0] === wholeBracket.length - 1) return;
      wholeBracket[this.crd[0] + 1][Math.floor(this.crd[1] / 2)].fillOneTeam(this.score[0] > this.score[1] ? this.teams[0] : this.teams[1], this.crd[1]);
    }
  }

  reset() {
    this.id = null;
    this.teams = [{
      name: null,
      id: null
    }, {
      name: null,
      id: null
    }];
    this.score = [null, null];
  }

}

export default Match;