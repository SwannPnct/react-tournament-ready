import React, { useEffect, useState } from 'react'; //sub component

import Game from './Game'; //helpers

import { copyBracket, copyMatch, createBracket, extractTeams, findMatchByTeamID, insertScore } from './helpers'; //main component

const Tournament = props => {
  const [bracket, setBracket] = useState([]);
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    if (props.loadBracketData) {
      //extracting players from the bracket data
      setTeams(extractTeams(props.loadBracketData)); //loading the bracket

      setBracket(copyBracket(props.loadBracketData));
      return;
    }

    const newBracket = createBracket(props.teams);
    setTeams(extractTeams(newBracket));
    setBracket(newBracket);
  }, []);
  useEffect(() => {
    // for sockets or load from backend/DB
    if (props.loadBracketData) {
      //retrieving the teams data and order via the tournament 1st round
      let teamsFromLoad = []; //getting teams from 1st round from game that have teams only (filter method, could have been done with condition check in for each)

      props.loadBracketData[0].filter(match => match.teams[0].id).forEach(match => teamsFromLoad = teamsFromLoad.concat(match.teams)); // teams wont get concatenated
      //getting teams from 2nd round and verifying presence in teamsFromLoad to avoid duplicate

      props.loadBracketData[1].forEach(match => match.teams.forEach(team => {
        if (team.id && teamsFromLoad.findIndex(loaded => loaded.id === team.id) === -1) teamsFromLoad.push(team);
      }));
      setTeams(teamsFromLoad.map(team => {
        return { ...team
        };
      })); //loading the bracket

      setBracket(copyBracket(props.loadBracketData));
    }
  }, [props.loadBracketData]);
  useEffect(() => {
    if (bracket.length === 0) return; //sending current user match data ( deep copy)

    if (props.getMatchData) props.getMatchData(findMatchByTeamID(props.team, bracket)); //sending bracket data ( deep copy)

    if (props.getBracketData) props.getBracketData(copyBracket(bracket));
  }, [bracket]);
  useEffect(() => {
    if (!props.insertScore) return;
    const {
      score
    } = props.insertScore;
    setBracket(insertScore(props.team, score, bracket));
  }, [props.insertScore]); //helper to get the instance of the match ( to access its method as it's not a deep copy)
  //NOT USED FOR NOW

  const handleFindMatchInstanceByTeamID = teamID => {
    let matchFound = null;
    bracket.forEach(round => {
      round.forEach(match => {
        if (match.teams.findIndex(team => team.id === teamID) !== -1) return matchFound = match;
      });
    });
    return matchFound;
  }; //sending clicked match data


  const handleSendClickedMatchData = crd => {
    if (props.onClickMatch) props.onClickMatch(copyMatch(bracket[crd[0]][crd[1]]));
  }; //inline styles
  //bracket inline style to create a dynamic height for the bracket


  const bracketStyle = {
    display: "flex",
    height: bracket[0] ? bracket[0].length * 100 + "px" : "800px",
    width: 230 * bracket.length + "px",
    overflow: "scroll"
  };
  const roundsStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    margin: "30px"
  }; //rendering functions
  //handleSetScore prop is for testing only ( related to onclick event)

  const renderBracket = bracket.map((round, i) => /*#__PURE__*/React.createElement("div", {
    style: roundsStyle,
    key: i
  }, round.map((match, j) => /*#__PURE__*/React.createElement(Game, {
    teamID: props.team.id,
    teams: match.teams,
    score: match.score,
    crd: [i, j],
    key: i + j,
    bracketHeight: bracketStyle.height,
    bracketWidth: bracketStyle.width,
    roundsMargin: roundsStyle.margin,
    bracketLength: bracket.length,
    handleClickOnMatchFromParent: crd => handleSendClickedMatchData(crd),
    gamesStyle: props.gamesStyle,
    teamGamesStyle: props.teamGamesStyle,
    gamesDivStyleTop: props.gamesDivStyleTop,
    gamesDivStyleBottom: props.gamesDivStyleBottom,
    gamesDivStyleLeft: props.gamesDivStyleLeft,
    gamesDivStyleRight: props.gamesDivStyleRight,
    winningScoreStyle: props.winningScoreStyle
  }))));
  return /*#__PURE__*/React.createElement("div", {
    style: bracketStyle
  }, renderBracket);
};

export default Tournament;